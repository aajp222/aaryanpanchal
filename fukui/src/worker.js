// fukui.aaryanpanchal.com — serves the static page from ./public and accepts
// interest registrations at POST /api/register.
//
// Registrations are validated here, then forwarded to a private Power Automate
// flow that adds one row to the team's Excel tracker. The flow's signed trigger
// URL is the only credential and lives in the Worker secret FLOW_URL; nothing in
// ./public can reach the workbook directly.

const LANGS = { en: 'English', ja: 'Japanese', either: 'Either' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX = { name: 200, email: 254, organization: 200, availability: 1000, comments: 2000 };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// Excel would treat a leading = + - @ as a formula; the apostrophe makes it text.
const cell = (v) => (/^[=+\-@\t\r]/.test(v) ? "'" + v : v);

function validTimeZone(tz) {
  if (!tz || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function validate(input) {
  const d = {
    id: str(input.id),
    name: str(input.name),
    email: str(input.email),
    organization: str(input.organization),
    language: str(input.language),
    availability: str(input.availability),
    timezone: str(input.timezone),
    comments: str(input.comments),
    consent: input.consent === true,
    formLanguage: input.formLanguage === 'ja' ? 'ja' : 'en',
  };
  const fields = {};
  if (!d.name) fields.name = 'errName';
  if (!d.email) fields.email = 'errEmail';
  else if (!EMAIL_RE.test(d.email)) fields.email = 'errEmailFormat';
  if (!LANGS[d.language]) fields.language = 'errLanguage';
  if (!d.availability) fields.availability = 'errAvailability';
  if (!validTimeZone(d.timezone)) fields.timezone = 'errTimezone';
  if (!d.consent) fields.consent = 'errConsent';
  for (const [k, n] of Object.entries(MAX)) if (d[k].length > n) fields[k] = fields[k] || 'tooLong';
  if (!UUID_RE.test(d.id)) d.id = crypto.randomUUID();
  return { data: d, fields };
}

async function register(request, env) {
  // Only accept same-origin posts from the page itself.
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ ok: false }, 415);

  let input;
  try {
    const text = await request.text();
    if (text.length > 16000) return json({ ok: false }, 413);
    input = JSON.parse(text);
  } catch {
    return json({ ok: false }, 400);
  }
  if (!input || typeof input !== 'object') return json({ ok: false }, 400);

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (str(input.website)) return json({ ok: true });

  const { data, fields } = validate(input);
  if (Object.keys(fields).length) return json({ ok: false, fields }, 400);

  if (!env.FLOW_URL) {
    console.error('FLOW_URL not configured');
    return json({ ok: false }, 503);
  }

  // Keys match the Excel table's column headers one-to-one.
  const row = {
    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    name: cell(data.name),
    email: cell(data.email),
    organization: cell(data.organization),
    language: LANGS[data.language],
    availability: cell(data.availability),
    timezone: data.timezone,
    comments: cell(data.comments),
    consent: 'Yes',
    formLanguage: data.formLanguage === 'ja' ? '日本語' : 'English',
    submissionId: data.id,
    status: 'New',
  };

  try {
    const res = await fetch(env.FLOW_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(row),
    });
    if (res.ok) return json({ ok: true });
    console.error('flow rejected', res.status, (await res.text()).slice(0, 300));
  } catch (err) {
    console.error('flow unreachable', String(err));
  }
  return json({ ok: false }, 502);
}

// Tell the page which country the visitor is in (from Cloudflare, never the IP
// itself) so app.js can pick Japanese for visitors in Japan whose phone is set to
// neither Japanese nor English.
function withCountry(res, request) {
  const country = request.cf && request.cf.country;
  if (!country || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  const out = new HTMLRewriter()
    .on('html', { element: (el) => el.setAttribute('data-country', country) })
    .transform(res);
  const headers = new Headers(out.headers);
  headers.delete('etag'); // the body now varies by visitor
  headers.set('cache-control', 'private, no-cache');
  return new Response(out.body, { status: out.status, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Plain-HTTP visitors get the HTTPS page (DEV is set only in local .dev.vars).
    if (url.protocol === 'http:' && !env.DEV) {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/api/register') {
      if (request.method !== 'POST') return json({ ok: false }, 405);
      return register(request, env);
    }
    return withCountry(await env.ASSETS.fetch(request), request);
  },
};
