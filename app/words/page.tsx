'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Word {
  id: number;
  irish: string;
  english: string;
  pronunciation: string | null;
  repetitions: number;
  next_review: number;
  ease_factor: number;
  interval: number;
  created_at: number;
}

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/words')
      .then(r => r.json())
      .then(data => { setWords(data); setLoading(false); });
  }, []);

  const filtered = words.filter(w =>
    w.irish.toLowerCase().includes(search.toLowerCase()) ||
    w.english.toLowerCase().includes(search.toLowerCase())
  );

  const now = Math.floor(Date.now() / 1000);

  if (loading) return <div className="text-stone-400 text-center py-16">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-800">Your Words</h1>
        <Link href="/add" className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors">
          + Add Word
        </Link>
      </div>

      <input
        type="search"
        placeholder="Search Irish or English..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          {words.length === 0 ? (
            <>
              <p className="text-lg mb-3">No words yet!</p>
              <Link href="/add" className="text-emerald-600 font-medium hover:underline">Add your first word →</Link>
            </>
          ) : (
            <p>No words match your search.</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(word => {
            const isDue = word.next_review <= now;
            return (
              <Link
                key={word.id}
                href={`/words/${word.id}`}
                className="block bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-800 truncate">{word.irish}</p>
                    <p className="text-sm text-stone-500 truncate">{word.english}</p>
                    {word.pronunciation && (
                      <p className="text-xs text-stone-400 mt-0.5 italic">{word.pronunciation}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isDue && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Due</span>
                    )}
                    <span className="text-xs text-stone-400">
                      {word.repetitions === 0 ? 'New' : `${word.repetitions} review${word.repetitions !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p className="text-xs text-stone-400 text-right">{filtered.length} of {words.length} words</p>
    </div>
  );
}
