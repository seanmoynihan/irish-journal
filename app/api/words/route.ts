import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const due = searchParams.get('due');

  if (due === 'true') {
    const now = Math.floor(Date.now() / 1000);
    const words = db.prepare(`
      SELECT * FROM words WHERE next_review <= ? ORDER BY next_review ASC
    `).all(now);
    return NextResponse.json(words);
  }

  const words = db.prepare('SELECT * FROM words ORDER BY created_at DESC').all();
  return NextResponse.json(words);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();
  const { irish, english, pronunciation, notes } = body;

  if (!irish?.trim() || !english?.trim()) {
    return NextResponse.json({ error: 'Irish and English fields are required' }, { status: 400 });
  }

  const result = db.prepare(`
    INSERT INTO words (irish, english, pronunciation, notes)
    VALUES (?, ?, ?, ?)
  `).run(irish.trim(), english.trim(), pronunciation?.trim() || null, notes?.trim() || null);

  const word = db.prepare('SELECT * FROM words WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(word, { status: 201 });
}
