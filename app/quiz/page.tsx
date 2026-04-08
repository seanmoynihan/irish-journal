'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Word {
  id: number;
  irish: string;
  english: string;
  pronunciation: string | null;
  repetitions: number;
  ease_factor: number;
  interval: number;
}

type Phase = 'loading' | 'empty' | 'question' | 'revealed' | 'done';

const QUALITY_BUTTONS = [
  { quality: 5, label: 'Perfect', color: 'bg-emerald-600 hover:bg-emerald-700' },
  { quality: 4, label: 'Good', color: 'bg-emerald-500 hover:bg-emerald-600' },
  { quality: 3, label: 'Okay', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { quality: 2, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600' },
  { quality: 1, label: 'Wrong', color: 'bg-red-500 hover:bg-red-600' },
];

export default function QuizPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [hint, setHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [results, setResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [direction, setDirection] = useState<'ir-to-en' | 'en-to-ir'>('ir-to-en');

  useEffect(() => {
    fetch('/api/words?due=true')
      .then(r => r.json())
      .then(data => {
        setWords(shuffle(data));
        setPhase(data.length === 0 ? 'empty' : 'question');
      });
  }, []);

  const current = words[index];

  async function reveal() {
    setPhase('revealed');
  }

  async function grade(quality: number) {
    if (!current) return;
    await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word_id: current.id, quality }),
    });

    const correct = quality >= 3;
    setResults(r => ({ correct: r.correct + (correct ? 1 : 0), total: r.total + 1 }));
    setHint('');

    if (index + 1 >= words.length) {
      setPhase('done');
    } else {
      setIndex(i => i + 1);
      setPhase('question');
    }
  }

  async function getHint() {
    if (!current) return;
    setHint('');
    setHintLoading(true);
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'quiz_hint', irish: current.irish, english: current.english }),
    });
    if (!res.body) { setHintLoading(false); return; }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setHint(prev => prev + decoder.decode(value));
    }
    setHintLoading(false);
  }

  if (phase === 'loading') return <div className="text-stone-400 text-center py-16">Loading...</div>;

  if (phase === 'empty') return (
    <div className="text-center py-16 space-y-4">
      <p className="text-4xl">🎉</p>
      <h2 className="text-xl font-bold text-stone-700">All caught up!</h2>
      <p className="text-stone-500">No words due for review right now.</p>
      <Link href="/add" className="inline-block text-emerald-600 font-medium hover:underline">Add new words →</Link>
    </div>
  );

  if (phase === 'done') return (
    <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
      <p className="text-4xl">✅</p>
      <h2 className="text-xl font-bold text-stone-700">Quiz Complete!</h2>
      <p className="text-stone-500">
        {results.correct} / {results.total} correct ({Math.round(results.correct / results.total * 100)}%)
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/" className="bg-emerald-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition-colors">Dashboard</Link>
        <Link href="/add" className="border border-stone-300 px-5 py-2 rounded-lg font-semibold hover:bg-stone-50 transition-colors">Add Word</Link>
      </div>
    </div>
  );

  const showIrish = direction === 'ir-to-en';

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-stone-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all"
            style={{ width: `${(index / words.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-stone-500">{index + 1} / {words.length}</span>
      </div>

      {/* Direction toggle */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setDirection('ir-to-en')}
          className={`px-3 py-1 rounded-full border transition-colors ${direction === 'ir-to-en' ? 'bg-emerald-700 text-white border-emerald-700' : 'border-stone-300 text-stone-500'}`}
        >
          Irish → English
        </button>
        <button
          onClick={() => setDirection('en-to-ir')}
          className={`px-3 py-1 rounded-full border transition-colors ${direction === 'en-to-ir' ? 'bg-emerald-700 text-white border-emerald-700' : 'border-stone-300 text-stone-500'}`}
        >
          English → Irish
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 text-center min-h-48 flex flex-col items-center justify-center gap-4">
        <p className="text-xs text-stone-400 uppercase tracking-wide">{showIrish ? 'Irish' : 'English'}</p>
        <h2 className="text-3xl font-bold text-stone-800">
          {showIrish ? current.irish : current.english}
        </h2>
        {showIrish && current.pronunciation && phase === 'revealed' && (
          <p className="text-sm text-stone-400 italic">{current.pronunciation}</p>
        )}

        {phase === 'revealed' && (
          <div className="mt-2 pt-4 border-t border-stone-100 w-full">
            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{showIrish ? 'English' : 'Irish'}</p>
            <p className="text-xl font-semibold text-emerald-700">{showIrish ? current.english : current.irish}</p>
          </div>
        )}
      </div>

      {/* Hint */}
      {phase === 'question' && (
        <div>
          <button
            onClick={getHint}
            disabled={hintLoading || !!hint}
            className="text-xs text-stone-400 hover:text-emerald-600 transition-colors"
          >
            {hintLoading ? 'Getting hint...' : hint ? '' : '💡 Get a hint'}
          </button>
          {hint && <p className="text-sm text-stone-500 italic mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">{hint}</p>}
        </div>
      )}

      {/* Actions */}
      {phase === 'question' ? (
        <button
          onClick={reveal}
          className="w-full bg-stone-800 text-white py-3 rounded-xl font-semibold hover:bg-stone-900 transition-colors"
        >
          Show Answer
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-stone-500 text-center">How well did you know it?</p>
          <div className="grid grid-cols-5 gap-2">
            {QUALITY_BUTTONS.map(({ quality, label, color }) => (
              <button
                key={quality}
                onClick={() => grade(quality)}
                className={`${color} text-white py-2 rounded-lg text-xs font-semibold transition-colors`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
