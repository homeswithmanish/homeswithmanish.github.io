// Notify IndexNow (Bing, Yandex, Seznam, Naver; Bing powers ChatGPT search
// and Copilot) that pages changed. Run AFTER the deploy is live.
// Usage: node tools/indexnow.mjs            -> submits every <loc> in sitemap.xml
//        node tools/indexnow.mjs /blog/ ... -> submits only the given paths
// The key file bcb075ffcc48b68af0c0638a48e17eec.txt at the site root proves ownership; keep it deployed.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "homeswithmanish.com";
const KEY = "bcb075ffcc48b68af0c0638a48e17eec";

const args = process.argv.slice(2);
const urls = args.length
  ? args.map((p) => `https://${HOST}${p.startsWith("/") ? p : "/" + p}`)
  : [...readFileSync(join(ROOT, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);
if (res.status >= 400) process.exit(1);
