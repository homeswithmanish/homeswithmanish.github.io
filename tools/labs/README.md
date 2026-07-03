# Labs — private project previews on homeswithmanish.com

Host any number of private, invite-only project pages under `/labs/<slug>/` on this
(public!) GitHub Pages repo. Nothing links to them, they carry `noindex`, and — the part
that actually matters — **only AES-256-GCM ciphertext is ever committed**. Each friend
gets a personal access code; the page decrypts in their browser.

## One-time setup

```sh
cp tools/labs/access.local.example.json tools/labs/access.local.json
```

`access.local.json` is gitignored. It is the ONLY place codes live — never commit it.

## Publish / update a project

1. Build the project into a single self-contained HTML file (no external assets).
2. Define who can see it in `access.local.json`:
   ```json
   {
     "friends":  { "manish": "", "priya": "", "sam": "" },
     "projects": { "tax-season": ["manish", "priya"] }
   }
   ```
   Empty code strings are auto-filled with generated codes (e.g. `maple-tide-42`) on publish.
3. ```sh
   node tools/labs/publish.mjs tax-season /path/to/built.html
   ```
   It prints a personal one-click link per friend, e.g.
   `https://homeswithmanish.com/labs/tax-season/#k=maple-tide-42`
   (the `#k=` fragment is processed in-browser only; it never appears in any server log).
4. Commit `labs/<slug>/index.html` and push — GitHub Actions deploys it.

## Grant / revoke access

- **Grant:** add the friend's name to the project's list → re-run publish → push. Send them their link.
- **Revoke:** remove the name → re-run publish → push. Every publish generates a fresh
  content key, so old codes stop working on the new version immediately.

## Honest security notes

- Codes are strengthened with PBKDF2 (600k iterations) before use, but anyone can download
  the ciphertext and brute-force **weak** codes offline. Use the generated codes (or longer).
- Revocation is not retroactive: old ciphertexts live in git history and a friend who
  already opened a version could have saved it. Fine for prototypes; don't put secrets here.
- Friend names never appear in committed files — key entries are anonymous and shuffled.
- Don't add `/labs/` to robots.txt or the sitemap (a robots entry would advertise the path).
