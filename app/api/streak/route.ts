import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const streak = db.prepare('SELECT * FROM streak WHERE id = 1').get() as any;
  const totalWords = (db.prepare('SELECT COUNT(*) as count FROM words').get() as any).count;
  const now = Math.floor(Date.now() / 1000);
  const dueCount = (db.prepare('SELECT COUNT(*) as count FROM words WHERE next_review <= ?').get(now) as any).count;
  const reviewedToday = (db.prepare(`
    SELECT COUNT(DISTINCT word_id) as count FROM quiz_results
    WHERE reviewed_at >= unixepoch('now', 'start of day')
  `).get() as any).count;

  return NextResponse.json({
    current_streak: streak.current_streak,
    longest_streak: streak.longest_streak,
    last_active_date: streak.last_active_date,
    total_words: totalWords,
    due_count: dueCount,
    reviewed_today: reviewedToday,
  });
}
