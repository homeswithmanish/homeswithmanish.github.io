#!/usr/bin/env node
// Labs publisher — encrypts a self-contained HTML project into labs/<slug>/index.html
// with per-friend envelope encryption (AES-256-GCM content key, wrapped per friend
// via PBKDF2-derived keys). The repo is PUBLIC: only ciphertext is ever committed.
//
// Usage:
//   node tools/labs/publish.mjs <slug> <path-to-built-html>
//
// Access control lives in tools/labs/access.local.json (gitignored — never commit it):
//   {
//     "friends":  { "alice": "her-access-code", "bob": "" },   // empty = auto-generate
//     "projects": { "tax-season": ["alice", "bob"] }
//   }
//
// Grant:  add the friend's name to the project's list, re-run publish.
// Revoke: remove the name, re-run publish (a fresh content key is generated every
//         publish, so removed friends can't open the new version; versions they
//         already opened may have been saved by them — revocation is not retroactive).

import { webcrypto as crypto } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ITERATIONS = 600_000
const SITE = 'https://homeswithmanish.com'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '..', '..')
const accessPath = join(here, 'access.local.json')

const [slug, sourcePath] = process.argv.slice(2)
if (!slug || !sourcePath) {
  console.error('Usage: node tools/labs/publish.mjs <slug> <path-to-built-html>')
  process.exit(1)
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('Slug must be lowercase letters, digits, hyphens.')
  process.exit(1)
}

let access
try {
  access = JSON.parse(readFileSync(accessPath, 'utf8'))
} catch {
  console.error(`Missing or invalid ${accessPath}. Copy access.local.example.json to access.local.json first.`)
  process.exit(1)
}

const names = access.projects?.[slug]
if (!names || names.length === 0) {
  console.error(`No friends listed for project "${slug}" in access.local.json → projects.`)
  process.exit(1)
}

// auto-generate access codes for friends that don't have one yet
const WORDS = 'amber,birch,cedar,delta,ember,frost,grove,harbor,indigo,juniper,koa,lumen,maple,nectar,onyx,pearl,quartz,ridge,sable,tide,umber,vista,willow,yarrow,zephyr'.split(',')
const genCode = () => {
  const pick = () => WORDS[crypto.getRandomValues(new Uint32Array(1))[0] % WORDS.length]
  const num = crypto.getRandomValues(new Uint32Array(1))[0] % 90 + 10
  return `${pick()}-${pick()}-${num}`
}
let accessChanged = false
for (const n of names) {
  if (!(n in (access.friends ?? {}))) {
    console.error(`Friend "${n}" is not defined under friends. Add them first.`)
    process.exit(1)
  }
  if (!access.friends[n]) {
    access.friends[n] = genCode()
    accessChanged = true
  }
}
if (accessChanged) writeFileSync(accessPath, JSON.stringify(access, null, 2) + '\n')

const b64 = (buf) => Buffer.from(buf).toString('base64')

const html = readFileSync(sourcePath)
const gz = gzipSync(html, { level: 9 })

// fresh content key every publish → re-publishing rotates access
const K = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
const rawK = await crypto.subtle.exportKey('raw', K)
const payloadIv = crypto.getRandomValues(new Uint8Array(12))
const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: payloadIv }, K, gz)

const enc = new TextEncoder()
const keys = []
for (const name of names) {
  const password = access.friends[name]
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const mat = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  const kek = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    mat, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
  )
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const wrapped = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, kek, rawK)
  // NOTE: no friend names in the committed output — entries are anonymous on purpose.
  keys.push({ salt: b64(salt), iv: b64(iv), wrapped: b64(wrapped) })
}

// shuffle so committed key order doesn't mirror access.local.json order
for (let i = keys.length - 1; i > 0; i--) {
  const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1)
  ;[keys[i], keys[j]] = [keys[j], keys[i]]
}

const payload = {
  v: 1,
  iter: ITERATIONS,
  gz: true,
  payload: { iv: b64(payloadIv), ct: b64(ct) },
  keys,
}

const template = readFileSync(join(here, 'unlock-template.html'), 'utf8')
const out = template.replace('__LABS_PAYLOAD__', JSON.stringify(payload))
const outDir = join(repoRoot, 'labs', slug)
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'index.html'), out)

console.log(`\nPublished labs/${slug}/index.html (${(out.length / 1024).toFixed(0)} KB, ${names.length} friend(s))\n`)
console.log('Share links (each is personal — the #k fragment never reaches any server):\n')
for (const name of names) {
  console.log(`  ${name.padEnd(12)} ${SITE}/labs/${slug}/#k=${encodeURIComponent(access.friends[name])}`)
}
console.log(`\nOr send the bare URL ${SITE}/labs/${slug}/ plus the code separately.`)
console.log('Remember: commit & push the labs/ output for it to go live.\n')
