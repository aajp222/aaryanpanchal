// fukui.aaryanpanchal.com — serves the static page from ./public and accepts
// interest registrations at POST /api/register.
//
// Registrations are validated here, then forwarded to a private Google Apps
// Script web app that appends one row to the team's tracker sheet. The relay's
// URL and shared secret live only in Worker secrets (APPS_SCRIPT_URL,
// RELAY_SECRET); nothing in ./public can reach the sheet directly.

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

  if (!env.APPS_SCRIPT_URL || !env.RELAY_SECRET) {
    console.error('relay not configured');
    return json({ ok: false }, 503);
  }

  const row = {
    secret: env.RELAY_SECRET,
    id: data.id,
    submittedAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    organization: data.organization,
    language: LANGS[data.language],
    availability: data.availability,
    timezone: data.timezone,
    comments: data.comments,
    consent: 'Yes',
    formLanguage: data.formLanguage === 'ja' ? '日本語' : 'English',
  };

  try {
    const res = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(row),
      redirect: 'follow',
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.ok) return json({ ok: true });
    console.error('relay rejected', res.status, body.error || '');
  } catch (err) {
    console.error('relay unreachable', String(err));
  }
  return json({ ok: false }, 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/register') {
      if (request.method !== 'POST') return json({ ok: false }, 405);
      return register(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
