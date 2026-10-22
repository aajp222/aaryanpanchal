// Fukui's Seafood Heritage — language switch, validation and submission.
(function () {
  'use strict';

  var CONTACT = 'gr-fukuifishfellowship@wpi.edu';
  var MAIL = '<a href="mailto:' + CONTACT + '">' + CONTACT + '</a>';

  var T = {
    en: {
      docTitle: 'Fukui’s Seafood Heritage · WPI IQP Research Team',
      eyebrow: 'WPI · IQP Research Team',
      title: 'Fukui’s<br>Seafood Heritage',
      affil: 'Worcester Polytechnic Institute',
      intro1: 'We are a WPI student research team studying Fukui’s seafood heritage, regional certifications, and local communities.',
      intro2: 'We would value hearing from people connected to Fukui’s seafood. If you may be open to an interview, please register your interest below.',
      cta: 'Register interest in an interview',
      formTitle: 'Register interest',
      formNote: 'This form only registers your interest. It is not a confirmed appointment — our team will contact you by email to arrange a time.',
      noscript: 'This form needs JavaScript. You can also email us at ' + MAIL + '.',
      name: 'Name',
      email: 'Email',
      org: 'Organization or role',
      optional: '(optional)',
      language: 'Preferred interview language',
      langEn: 'English',
      langJa: 'Japanese (日本語)',
      langEither: 'Either',
      availability: 'Availability',
      availabilityHint: 'Days and times that generally work for you.',
      timezone: 'Time zone',
      timezoneHint: 'The time zone for the availability above.',
      tzJST: 'Japan Standard Time (JST, UTC+9)',
      tzOther: 'Other time zones',
      comments: 'Additional comments',
      consent: 'I agree to be contacted by the research team about an interview.',
      privacy: 'We will use this information only to contact you and coordinate an interview, and only our team can see it. Registering interest is not agreement to take part in the research: if an interview goes ahead, we will explain the study and ask for your consent — including for any recording — separately.',
      submit: 'Register interest',
      sending: 'Sending…',
      successTitle: 'Thank you — we’ve received your interest.',
      successBody: 'Our team will follow up by email to arrange an interview. This is not yet a confirmed appointment.',
      contactTitle: 'Contact',
      teamTitle: 'Team',
      footer: 'Worcester Polytechnic Institute · Interactive Qualifying Project',
      errSummary: 'Please check the following:',
      errName: 'Please enter your name.',
      errEmail: 'Please enter your email address.',
      errEmailFormat: 'Please enter a valid email address, like name@example.com.',
      errLanguage: 'Please choose a preferred interview language.',
      errAvailability: 'Please tell us when you are generally available.',
      errTimezone: 'Please choose a time zone.',
      errConsent: 'Please tick this box so we can contact you about an interview.',
      errNetwork: 'Sorry, we couldn’t send your registration. Your answers are still here — please try again in a moment, or email us at ' + MAIL + '.',
      errServer: 'Sorry, something went wrong on our side. Your answers are still here — please try again in a moment, or email us at ' + MAIL + '.'
    },
    ja: {
      docTitle: '福井の水産文化 · WPI IQP研究チーム',
      eyebrow: 'WPI · IQP研究チーム',
      title: '福井の<br>水産文化',
      affil: 'ウースター工科大学（WPI）',
      intro1: '私たちはウースター工科大学（WPI）の学生研究チームです。福井の水産文化、地域の認証制度、そして地域社会について研究しています。',
      intro2: '福井の海の幸に関わる皆さまのお話を、ぜひお聞かせください。インタビューにご協力いただける可能性がある方は、下記よりご登録をお願いいたします。',
      cta: 'インタビュー協力の希望を登録',
      formTitle: '協力希望の登録',
      formNote: 'このフォームはご協力の希望を伺うためのもので、日程が確定するものではありません。後日、研究チームからメールでご連絡し、日時を調整いたします。',
      noscript: 'このフォームの利用にはJavaScriptが必要です。' + MAIL + ' までメールでご連絡いただくこともできます。',
      name: 'お名前',
      email: 'メールアドレス',
      org: 'ご所属・お立場',
      optional: '（任意）',
      language: 'インタビューの希望言語',
      langEn: '英語',
      langJa: '日本語',
      langEither: 'どちらでも可',
      availability: 'ご都合のよい日時',
      availabilityHint: 'ご都合のよい曜日や時間帯をご記入ください。',
      timezone: 'タイムゾーン',
      timezoneHint: '上記の日時のタイムゾーンです。',
      tzJST: '日本標準時（JST、UTC+9）',
      tzOther: 'その他のタイムゾーン',
      comments: '備考',
      consent: 'インタビューについて、研究チームから連絡を受けることに同意します。',
      privacy: 'ご記入いただいた情報は、ご連絡とインタビュー日程の調整のためにのみ使用し、研究チーム以外が閲覧することはありません。このご登録は研究への参加に同意するものではありません。インタビューを実施する場合は、研究内容をご説明したうえで、録音・録画を含めた同意をあらためてお願いいたします。',
      submit: '登録する',
      sending: '送信中…',
      successTitle: 'ご登録ありがとうございます。',
      successBody: '研究チームからメールでご連絡し、インタビューの日程を調整いたします。現時点では日程は確定していません。',
      contactTitle: 'お問い合わせ',
      teamTitle: 'チーム',
      footer: 'ウースター工科大学 · IQP（Interactive Qualifying Project）',
      errSummary: '次の項目をご確認ください。',
      errName: 'お名前を入力してください。',
      errEmail: 'メールアドレスを入力してください。',
      errEmailFormat: '有効なメールアドレスを入力してください（例：name@example.com）。',
      errLanguage: 'インタビューの希望言語を選択してください。',
      errAvailability: 'ご都合のよい日時をご記入ください。',
      errTimezone: 'タイムゾーンを選択してください。',
      errConsent: 'ご連絡のため、同意欄にチェックを入れてください。',
      errNetwork: '送信できませんでした。入力内容はそのまま残っています。しばらくしてからもう一度お試しいただくか、' + MAIL + ' までメールでご連絡ください。',
      errServer: 'サーバー側で問題が発生しました。入力内容はそのまま残っています。しばらくしてからもう一度お試しいただくか、' + MAIL + ' までメールでご連絡ください。'
    }
  };

  var DRAFT_KEY = 'fukui-interest-draft';
  var LANG_KEY = 'fukui-lang';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var lang = 'en';
  var errors = {};       // field -> message key
  var notice = null;     // summary-level message key (network / server)
  var sending = false;

  var form = document.getElementById('interest');
  var summary = document.getElementById('summary');
  var submitBtn = document.getElementById('submit');
  var success = document.getElementById('success');
  var tzSelect = document.getElementById('timezone');

  function store(kind, key, value) {
    try {
      var s = kind === 'local' ? window.localStorage : window.sessionStorage;
      if (value === undefined) return s.getItem(key);
      if (value === null) s.removeItem(key); else s.setItem(key, value);
    } catch (e) { return null; }
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16);
    crypto.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }

  // ── language ──────────────────────────────────────
  function setLang(next, persist) {
    lang = T[next] ? next : 'en';
    var dict = T[lang];
    document.documentElement.lang = lang;
    document.title = dict.docTitle;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v !== undefined) el.innerHTML = v; // trusted strings from T only
    });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    });
    var og = tzSelect.querySelector('optgroup');
    if (og) og.label = dict.tzOther;
    if (sending) submitBtn.textContent = dict.sending;
    renderErrors();
    if (persist) {
      store('local', LANG_KEY, lang);
      var url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }
  }

  function initialLang() {
    var q = new URLSearchParams(window.location.search).get('lang');
    if (q && T[q]) return q;
    var saved = store('local', LANG_KEY);
    if (saved && T[saved]) return saved;
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^ja\b/i.test(nav) ? 'ja' : 'en';
  }

  // ── time zones (JST first and selected by default) ─
  function offsetLabel(zone) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' }).formatToParts(new Date());
      for (var i = 0; i < parts.length; i++) if (parts[i].type === 'timeZoneName') return parts[i].value.replace('GMT', 'UTC').replace(/^UTC$/, 'UTC±0');
    } catch (e) {}
    return '';
  }

  function buildZones() {
    var zones = [];
    try { zones = Intl.supportedValuesOf('timeZone'); } catch (e) {
      zones = ['UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Seoul', 'Asia/Shanghai', 'Australia/Sydney'];
    }
    var og = document.createElement('optgroup');
    og.label = T[lang].tzOther;
    zones.forEach(function (z) {
      if (z === 'Asia/Tokyo') return;
      var o = document.createElement('option');
      o.value = z;
      var off = offsetLabel(z);
      o.textContent = z.replace(/_/g, ' ') + (off ? ' (' + off + ')' : '');
      og.appendChild(o);
    });
    tzSelect.appendChild(og);
  }

  // ── draft retention ───────────────────────────────
  var FIELDS = ['name', 'email', 'organization', 'availability', 'timezone', 'comments'];
  var submissionId = null;

  function saveDraft() {
    var d = { id: submissionId, consent: form.consent.checked, language: (form.querySelector('input[name="language"]:checked') || {}).value || '' };
    FIELDS.forEach(function (f) { d[f] = form[f].value; });
    store('session', DRAFT_KEY, JSON.stringify(d));
  }

  function loadDraft() {
    var raw = store('session', DRAFT_KEY), d = null;
    try { d = raw ? JSON.parse(raw) : null; } catch (e) {}
    submissionId = (d && d.id) || uuid();
    if (!d) return;
    FIELDS.forEach(function (f) {
      if (typeof d[f] !== 'string' || !d[f]) return;
      if (f === 'timezone' && !tzSelect.querySelector('option[value="' + CSS.escape(d[f]) + '"]')) return;
      form[f].value = d[f];
    });
    if (d.language) {
      var r = form.querySelector('input[name="language"][value="' + CSS.escape(d.language) + '"]');
      if (r) r.checked = true;
    }
    form.consent.checked = !!d.consent;
  }

  // ── validation ────────────────────────────────────
  var ORDER = ['name', 'email', 'language', 'availability', 'timezone', 'consent'];
  var TARGET = { language: function () { return form.querySelector('input[name="language"]'); } };

  function validate() {
    var e = {};
    var v = function (n) { return form[n].value.trim(); };
    if (!v('name')) e.name = 'errName';
    if (!v('email')) e.email = 'errEmail';
    else if (!EMAIL_RE.test(v('email'))) e.email = 'errEmailFormat';
    if (!form.querySelector('input[name="language"]:checked')) e.language = 'errLanguage';
    if (!v('availability')) e.availability = 'errAvailability';
    if (!form.timezone.value) e.timezone = 'errTimezone';
    if (!form.consent.checked) e.consent = 'errConsent';
    return e;
  }

  function fieldEl(name) { return TARGET[name] ? TARGET[name]() : form[name]; }

  function renderErrors() {
    var dict = T[lang];
    ORDER.forEach(function (name) {
      var p = document.getElementById(name + '-err');
      var key = errors[name];
      p.hidden = !key;
      p.textContent = key ? dict[key] : '';
      if (name === 'language') {
        form.querySelectorAll('input[name="language"]').forEach(function (r) { r.setAttribute('aria-invalid', String(!!key)); });
      } else {
        form[name].setAttribute('aria-invalid', String(!!key));
      }
    });
    var keys = ORDER.filter(function (n) { return errors[n]; });
    if (notice) {
      summary.innerHTML = dict[notice];
      summary.hidden = false;
    } else if (keys.length) {
      summary.innerHTML = '';
      var p = document.createElement('p');
      p.style.margin = '0 0 6px';
      p.textContent = dict.errSummary;
      var ul = document.createElement('ul');
      ul.style.margin = '0'; ul.style.paddingLeft = '1.2em';
      keys.forEach(function (n) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + fieldEl(n).id;
        a.textContent = dict[errors[n]];
        a.addEventListener('click', function (ev) { ev.preventDefault(); fieldEl(n).focus(); });
        li.appendChild(a); ul.appendChild(li);
      });
      summary.appendChild(p); summary.appendChild(ul);
      summary.hidden = false;
    } else {
      summary.hidden = true;
      summary.innerHTML = '';
    }
  }

  // Clear a field's error as soon as it's fixed. This runs on input only, never
  // on blur: a message vanishing as focus leaves a field shifts the layout under
  // the pointer and swallows the click on the next field.
  function recheck(name) {
    if (!errors[name] || validate()[name]) return;
    delete errors[name];
    renderErrors();
  }

  // ── submit ────────────────────────────────────────
  function setSending(on) {
    sending = on;
    submitBtn.disabled = on;
    submitBtn.textContent = T[lang][on ? 'sending' : 'submit'];
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (sending) return;
    notice = null;
    errors = validate();
    renderErrors();
    var first = ORDER.filter(function (n) { return errors[n]; })[0];
    if (first) { summary.focus(); return; }

    var payload = {
      id: submissionId,
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      organization: form.organization.value.trim(),
      language: form.querySelector('input[name="language"]:checked').value,
      availability: form.availability.value.trim(),
      timezone: form.timezone.value,
      comments: form.comments.value.trim(),
      consent: form.consent.checked,
      formLanguage: lang,
      website: form.website.value
    };

    setSending(true);
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 25000) : null;
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) { return { status: res.status, body: body }; });
    }).then(function (r) {
      if (r.status === 200 && r.body.ok) {
        store('session', DRAFT_KEY, null);
        form.hidden = true;
        success.hidden = false;
        success.focus();
        return;
      }
      if (r.status === 400 && r.body.fields) {
        errors = {};
        Object.keys(r.body.fields).forEach(function (f) { if (T.en[r.body.fields[f]]) errors[f] = r.body.fields[f]; });
        if (!Object.keys(errors).length) notice = 'errServer';
      } else {
        notice = 'errServer';
      }
      renderErrors();
      summary.focus();
    }).catch(function () {
      notice = 'errNetwork';
      renderErrors();
      summary.focus();
    }).then(function () {
      if (timer) clearTimeout(timer);
      setSending(false);
    });
  });

  form.addEventListener('input', function (ev) { saveDraft(); recheck(ev.target.name); });
  form.addEventListener('change', saveDraft);

  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang'), true); });
  });

  // Move focus into the form when the call-to-action is used.
  document.querySelector('a[href="#register"]').addEventListener('click', function () {
    setTimeout(function () { form.hidden ? success.focus() : form.name.focus({ preventScroll: true }); }, 350);
  });

  buildZones();
  loadDraft();
  setLang(initialLang(), false);
})();
