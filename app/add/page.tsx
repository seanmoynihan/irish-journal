'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddWord() {
  const router = useRouter();
  const [form, setForm] = useState({ irish: '', english: '', pronunciation: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
        return;
      }
      const word = await res.json();
      router.push(`/words/${word.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Add New Word</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-5">
        <Field label="Irish word / phrase *" htmlFor="irish">
          <input
            id="irish"
            type="text"
            required
            placeholder="e.g. Dia duit"
            value={form.irish}
            onChange={e => setForm(f => ({ ...f, irish: e.target.value }))}
            className="input"
          />
        </Field>

        <Field label="English translation *" htmlFor="english">
          <input
            id="english"
            type="text"
            required
            placeholder="e.g. Hello (lit. God to you)"
            value={form.english}
            onChange={e => setForm(f => ({ ...f, english: e.target.value }))}
            className="input"
          />
        </Field>

        <Field label="Pronunciation (optional)" htmlFor="pronunciation">
          <input
            id="pronunciation"
            type="text"
            placeholder="e.g. Dee-a gwitch"
            value={form.pronunciation}
            onChange={e => setForm(f => ({ ...f, pronunciation: e.target.value }))}
            className="input"
          />
        </Field>

        <Field label="Notes (optional)" htmlFor="notes">
          <textarea
            id="notes"
            rows={3}
            placeholder="Usage notes, grammar, context..."
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="input resize-none"
          />
        </Field>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-700 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-800 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Word'}
        </button>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #d6d3d1;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
