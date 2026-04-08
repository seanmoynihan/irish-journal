'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  total_words: number;
  due_count: number;
  reviewed_today: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/streak').then(r => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return <div className="text-stone-400 text-center py-16">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Fáilte!</h1>
        <p className="text-stone-500 mt-1">Welcome to your Irish language journal</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="🔥" label="Current Streak" value={`${stats.current_streak}d`} highlight={stats.current_streak > 0} />
        <StatCard icon="🏆" label="Best Streak" value={`${stats.longest_streak}d`} />
        <StatCard icon="📚" label="Total Words" value={String(stats.total_words)} />
        <StatCard icon="✅" label="Reviewed Today" value={String(stats.reviewed_today)} />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-700 mb-3">Due for Review</h2>
        {stats.due_count === 0 ? (
          <p className="text-stone-400 text-sm">🎉 All caught up! No words due for review.</p>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-stone-600">
              <span className="text-2xl font-bold text-emerald-700">{stats.due_count}</span>
              {' '}word{stats.due_count !== 1 ? 's' : ''} ready to review
            </p>
            <Link href="/quiz" className="bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors">
              Start Quiz →
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/add" className="block bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all group">
          <div className="text-2xl mb-2">➕</div>
          <h3 className="font-semibold text-stone-800 group-hover:text-emerald-700">Add New Word</h3>
          <p className="text-sm text-stone-500 mt-1">Log a new Irish word or phrase</p>
        </Link>
        <Link href="/words" className="block bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all group">
          <div className="text-2xl mb-2">📖</div>
          <h3 className="font-semibold text-stone-800 group-hover:text-emerald-700">Browse Words</h3>
          <p className="text-sm text-stone-500 mt-1">View and manage your vocabulary</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, highlight = false }: {
  icon: string; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${highlight ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-stone-200'}`}>
      <div className="text-xl mb-1">{icon}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-emerald-700' : 'text-stone-800'}`}>{value}</div>
      <div className="text-xs text-stone-500 mt-0.5">{label}</div>
    </div>
  );
}
