'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Word {
  id: number;
  irish: string;
  english: string;
  pronunciation: string | null;
  notes: string | null;
  repetitions: number;
  ease_factor: number;
  interval: number;
  next_review: number;
  last_reviewed: number | null;
  created_at: number;
}

export default function WordDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [word, setWord] = useState<Word | null>(null);
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ irish: '', english: '', pronunciation: '', notes: '' });

  useEffect(() => {
    fetch(`/api/words/${id}`).then(r => r.json()).then(data => {
      setWord(data);
      setEditForm({
        irish: data.irish,
        english: data.english,
        pronunciation: data.pronunciation ?? '',
        notes: data.notes ?? '',
      });
    });
  }, [id]);

  async function fetchAI(action: string) {
    if (!word) return;
    setAiContent('');
    setAiLoading(true);
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, irish: word.irish, english: word.english }),
    });
    if (!res.body) { setAiLoading(false); return; }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setAiContent(prev => prev + decoder.decode(value));
    }
    setAiLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this word?')) return;
    setDeleting(true);
    await fetch(`/api/words/${id}`, { method: 'DELETE' });
    router.push('/words');
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/words/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    const updated = await res.json();
    setWord(updated);
    setEditing(false);
  }

  if (!word) return <div className="text-stone-400 text-center py-16">Loading...</div>;

  const isDue = word.next_review <= Math.floor(Date.now() / 1000);

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/words" className="text-stone-400 hover:text-stone-600 text-sm">← Words</Link>
        {isDue && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Due for review</span>}
      </div>

      {editing ? (
        <form onSubmit={handleSaveEdit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-stone-700">Edit Word</h2>
          {(['irish', 'english', 'pronunciation', 'notes'] as const).map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-stone-500 mb-1 capitalize">{field}</label>
              <input
                type="text"
                value={editForm[field]}
                onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button type="submit" className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="border border-stone-300 px-4 py-2 rounded-lg text-sm hover:bg-stone-50 transition-colors">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-800">{word.irish}</h1>
              <p className="text-lg text-stone-600 mt-1">{word.english}</p>
              {word.pronunciation && <p className="text-sm text-stone-400 italic mt-1">{word.pronunciation}</p>}
              {word.notes && <p className="text-sm text-stone-500 mt-3 border-t border-stone-100 pt-3">{word.notes}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(true)} className="text-xs text-stone-400 hover:text-stone-600 border border-stone-200 rounded px-2 py-1">Edit</button>
              <button onClick={handleDelete} disabled={deleting} className="text-xs text-red-400 hover:text-red-600 border border-red-100 rounded px-2 py-1">Delete</button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-3 gap-3 text-center text-xs text-stone-500">
            <div>
              <div className="font-semibold text-stone-700 text-base">{word.repetitions}</div>
              Reviews
            </div>
            <div>
              <div className="font-semibold text-stone-700 text-base">{word.interval}d</div>
              Interval
            </div>
            <div>
              <div className="font-semibold text-stone-700 text-base">{word.ease_factor.toFixed(1)}</div>
              Ease
            </div>
          </div>
        </div>
      )}

      {/* AI Section */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-stone-700">AI Assistant</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => fetchAI('examples')} disabled={aiLoading} className="ai-btn">Example Sentences</button>
          <button onClick={() => fetchAI('explain')} disabled={aiLoading} className="ai-btn">Explain & Pronounce</button>
          <button onClick={() => fetchAI('quiz_hint')} disabled={aiLoading} className="ai-btn">Memory Hint</button>
        </div>
        {(aiLoading || aiContent) && (
          <div className="bg-stone-50 rounded-lg p-4 text-sm text-stone-700 whitespace-pre-wrap leading-relaxed min-h-12">
            {aiContent || <span className="text-stone-400 animate-pulse">Thinking...</span>}
          </div>
        )}
      </div>

      {isDue && (
        <Link href="/quiz" className="block text-center bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors">
          Start Quiz →
        </Link>
      )}

      <style jsx>{`
        .ai-btn {
          background: #f5f5f4;
          border: 1px solid #e7e5e4;
          border-radius: 0.5rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #44403c;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ai-btn:hover:not(:disabled) {
          background: #e7e5e4;
        }
        .ai-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
