# fukui.aaryanpanchal.com

Interview interest page for **Fukui’s Seafood Heritage** (WPI IQP Research Team).
Visitors scan the business-card QR code, read a short introduction in English or
日本語, and register interest in an interview. Each registration becomes one row in
the team’s private Google Sheet.

```
browser ──POST /api/register──▶ Cloudflare Worker ──(secret)──▶ Apps Script web app ──▶ Google Sheet
          (public/ page)        validates input                   appends one row         (private)
```

- `public/` — the whole page: `index.html`, `styles.css`, `app.js` (all text in both
  languages lives in the `T` object at the top of `app.js`), `hook.svg` (traced from
  the business card).
- `src/worker.js` — serves `public/` and validates submissions server-side.
- `apps-script/Code.gs` — the relay that writes to the sheet. The copy in this repo
  has a placeholder secret; the real copy lives only in Apps Script.
- `qr/` — QR code for `https://fukui.aaryanpanchal.com` (SVG/PDF for print, PNG).

Nothing in `public/` can read the sheet. The Apps Script URL and shared secret are
Worker secrets, never committed.

## Editing the page

1. Change text in `public/app.js` (both `en` and `ja` entries) — the English strings
   in `index.html` are only the no-JavaScript fallback, so keep them in step.
2. Preview: `npm install && npm run dev` → http://localhost:8787
   (submissions need a `.dev.vars` file with `APPS_SCRIPT_URL` and `RELAY_SECRET`).
3. Publish: `npm run deploy` (needs `npx wrangler login` once, on the Cloudflare
   account that owns aaryanpanchal.com).

## Managing responses

Open the **Fukui Seafood Heritage — Interview Interest Tracker (PRIVATE)** sheet.

- One row per registration; new rows arrive with **Follow-up status = New**.
- Use the **Follow-up status** dropdown (New → Contacted → Scheduled → Interviewed,
  or Declined / No response) and **Internal notes** column. These are never shown
  on the website.
- Timestamps are UTC; each person’s availability is in the time zone they chose.
- Share the sheet only with named teammates (Share → add their emails, *Editor*).
  Keep “General access” set to **Restricted**.
- Rows marked `TEST ENTRY` are from setup testing and can be deleted.

## One-time setup (already done unless noted)

1. **Apps Script relay** — in the tracker: Extensions → Apps Script, paste `Code.gs`
   (the private Drive copy with the real secret), Save, run `setup` once and
   authorise, then Deploy → New deployment → Web app → *Execute as: Me*,
   *Who has access: Anyone* → copy the `/exec` URL.
2. **Worker secrets** — `npx wrangler secret put APPS_SCRIPT_URL` and
   `npx wrangler secret put RELAY_SECRET` (same value as in `Code.gs`).
3. **Deploy** — `npm run deploy`. `wrangler.jsonc` attaches the custom domain
   `fukui.aaryanpanchal.com`, which creates the DNS record and HTTPS certificate
   automatically and leaves every other DNS record alone.

If the relay’s secret ever leaks, generate a new one, update it in both places, and
redeploy the Apps Script (Deploy → Manage deployments → Edit → New version).
