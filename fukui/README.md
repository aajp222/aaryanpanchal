# fukui.aaryanpanchal.com

Interview interest page for **Fukui’s Seafood Heritage** (WPI IQP Research Team).
Visitors scan the business-card QR code, read a short introduction in English or
日本語, and register interest in an interview. Each registration becomes one row in
the team’s private Excel workbook.

```
browser ──POST /api/register──▶ Cloudflare Worker ──signed URL──▶ Power Automate flow ──▶ Excel table
          (public/ page)        validates input                   "Add a row"              (OneDrive, private)
```

- `public/` — the whole page: `index.html`, `styles.css`, `app.js` (all text in both
  languages lives in the `T` object at the top of `app.js`), `hook.svg` (traced from
  the business card).
- `src/worker.js` — serves `public/` and validates submissions server-side.
- `excel/` — the tracker workbook template (table **Responses**) and the JSON schema
  for the flow trigger.
- `qr/` — QR code for `https://fukui.aaryanpanchal.com` (SVG/PDF for print, PNG).

Nothing in `public/` can read the workbook. The flow’s trigger URL is the only
credential; it is a Worker secret and never committed.

## Editing the page

1. Change text in `public/app.js` (both `en` and `ja` entries) — the English strings
   in `index.html` are only the no-JavaScript fallback, so keep them in step.
2. Preview: `npm install && npm run dev` → http://localhost:8787
   (submissions need a `.dev.vars` file with `FLOW_URL`).
3. Publish: `npm run deploy` (needs `npx wrangler login` once, on the Cloudflare
   account that owns aaryanpanchal.com).

## Managing responses

Open **Fukui Interview Interest Tracker.xlsx** in OneDrive / Excel.

- One row per registration; new rows arrive with **Follow-up status = New**.
- Use the **Follow-up status** dropdown (New → Contacted → Scheduled → Interviewed,
  or Declined / No response) and the **Internal notes** column. Neither is ever shown
  on the website.
- Timestamps are UTC; each person’s availability is in the time zone they chose.
- Don’t rename the table, its columns, or the file — the flow writes by those names.
  Sorting and filtering are fine.
- Share the file only with named teammates (Share → *Specific people*), never
  “Anyone with the link”.
- Rows marked `TEST ENTRY` are from setup testing and can be deleted.

## One-time setup

1. **Workbook** — upload `excel/Fukui Interview Interest Tracker.xlsx` to the OneDrive
   (or Teams/SharePoint) of the account that will own the flow.
2. **Flow** — in Power Automate: *Create → Instant cloud flow → skip*, then
   - Trigger **When an HTTP request is received**; *Who can trigger the flow*:
     **Anyone**; *Request Body JSON Schema*: paste `excel/trigger-schema.json`.
   - Action **Excel Online (Business) → Add a row into a table**: pick the file,
     table **Responses**, and map each column to the matching trigger field
     (Submitted at → `submittedAt`, Name → `name`, … Follow-up status → `status`;
     leave Internal notes empty).
   - Action **Response**: status code **200**, body `{"ok":true}`.
   - Save, then copy the trigger’s **HTTP URL**.
3. **Worker secret** — `npx wrangler secret put FLOW_URL` and paste that URL.
4. **Deploy** — `npm run deploy`. `wrangler.jsonc` attaches the custom domain
   `fukui.aaryanpanchal.com`, which creates its DNS record and HTTPS certificate
   automatically and leaves every other DNS record alone.

If the flow URL ever leaks, regenerate it in Power Automate (or recreate the
trigger), update the Worker secret, and redeploy.
