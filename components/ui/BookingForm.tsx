'use client';

import { useState } from 'react';

const SHOOTS = ['Aerial / Drone', 'Photography', 'Event / Sports', 'Real Estate', 'Product', 'A bit of everything'];
const BUDGETS = ['Prefer not to say', 'Under $200', '$200 – $500', '$500 – $1,000', '$1,000+'];

/**
 * No backend, because the site is static and a booking is a conversation
 * anyway. This composes the email the visitor would otherwise have to write.
 */
export default function BookingForm() {
  const [f, setF] = useState({ shoot: SHOOTS[0], name: '', email: '', date: '', location: '', budget: BUDGETS[0], notes: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const href =
    `mailto:aaryanpanchal@icloud.com?subject=${encodeURIComponent(`Shoot enquiry — ${f.shoot}`)}` +
    `&body=${encodeURIComponent(
      [
        `Shoot type: ${f.shoot}`,
        `Name: ${f.name}`,
        `Email: ${f.email}`,
        `Preferred date: ${f.date || '—'}`,
        `Location: ${f.location || '—'}`,
        `Budget: ${f.budget}`,
        '',
        f.notes || '',
      ].join('\n')
    )}`;

  const field = 'w-full border-b border-[var(--color-rule)] bg-transparent pb-2 outline-none placeholder:text-[var(--color-ink-4)] focus:border-[var(--accent)]';

  return (
    <form onSubmit={(e) => e.preventDefault()} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <label className="sm:col-span-2">
        <span className="label mb-2 block">What are we shooting?</span>
        <select value={f.shoot} onChange={set('shoot')} className={field}>
          {SHOOTS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>

      <label>
        <span className="label mb-2 block">Your name</span>
        <input value={f.name} onChange={set('name')} className={field} placeholder="Name" autoComplete="name" />
      </label>
      <label>
        <span className="label mb-2 block">Email</span>
        <input type="email" value={f.email} onChange={set('email')} className={field} placeholder="you@example.com" autoComplete="email" />
      </label>
      <label>
        <span className="label mb-2 block">Preferred date</span>
        <input type="date" value={f.date} onChange={set('date')} className={field} />
      </label>
      <label>
        <span className="label mb-2 block">Location</span>
        <input value={f.location} onChange={set('location')} className={field} placeholder="Worcester, MA" />
      </label>
      <label className="sm:col-span-2">
        <span className="label mb-2 block">Budget range (optional)</span>
        <select value={f.budget} onChange={set('budget')} className={field}>
          {BUDGETS.map((b) => <option key={b}>{b}</option>)}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="label mb-2 block">Anything else</span>
        <textarea value={f.notes} onChange={set('notes')} rows={3} className={`${field} resize-none`} placeholder="What's the occasion, what do you need back, when do you need it" />
      </label>

      <a
        href={href}
        className="label sm:col-span-2 inline-block w-fit rounded-full bg-[var(--page-ink)] px-6 py-3 !text-[var(--ground)] transition-opacity hover:opacity-80"
      >
        Open a pre-filled email →
      </a>
    </form>
  );
}
