import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  const { id } = await params;
  const word = db.prepare('SELECT * FROM words WHERE id = ?').get(Number(id));
  if (!word) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(word);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  const { id } = await params;
  const body = await request.json();
  const { irish, english, pronunciation, notes } = body;

  const existing = db.prepare('SELECT id FROM words WHERE id = ?').get(Number(id));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare(`
    UPDATE words SET irish = ?, english = ?, pronunciation = ?, notes = ?
    WHERE id = ?
  `).run(irish?.trim(), english?.trim(), pronunciation?.trim() || null, notes?.trim() || null, Number(id));

  const word = db.prepare('SELECT * FROM words WHERE id = ?').get(Number(id));
  return NextResponse.json(word);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getDb();
  const { id } = await params;
  const existing = db.prepare('SELECT id FROM words WHERE id = ?').get(Number(id));
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  db.prepare('DELETE FROM words WHERE id = ?').run(Number(id));
  return NextResponse.json({ success: true });
}
