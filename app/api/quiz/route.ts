import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { getDb } from '@/lib/db';
import { calculateSM2 } from '@/lib/sm2';

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();
  const { word_id, quality } = body;

  if (typeof quality !== 'number' || quality < 0 || quality > 5) {
    return NextResponse.json({ error: 'quality must be 0-5' }, { status: 400 });
  }

  const word = db.prepare('SELECT * FROM words WHERE id = ?').get(Number(word_id)) as any;
  if (!word) return NextResponse.json({ error: 'Word not found' }, { status: 404 });

  const result = calculateSM2(
    { ease_factor: word.ease_factor, interval: word.interval, repetitions: word.repetitions },
    quality
  );

  const now = Math.floor(Date.now() / 1000);

  db.prepare(`
    UPDATE words SET ease_factor = ?, interval = ?, repetitions = ?, next_review = ?, last_reviewed = ?
    WHERE id = ?
  `).run(result.ease_factor, result.interval, result.repetitions, result.next_review, now, word_id);

  db.prepare(`
    INSERT INTO quiz_results (word_id, quality) VALUES (?, ?)
  `).run(word_id, quality);

  // Update streak
  updateStreak(db);

  return NextResponse.json({ ...result, word_id });
}

function updateStreak(db: InstanceType<typeof Database>) {
  const today = new Date().toISOString().slice(0, 10);
  const streak = db.prepare('SELECT * FROM streak WHERE id = 1').get() as any;

  if (streak.last_active_date === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = streak.last_active_date === yesterday ? streak.current_streak + 1 : 1;
  const longestStreak = Math.max(newStreak, streak.longest_streak);

  db.prepare(`
    UPDATE streak SET last_active_date = ?, current_streak = ?, longest_streak = ?
    WHERE id = 1
  `).run(today, newStreak, longestStreak);
}
