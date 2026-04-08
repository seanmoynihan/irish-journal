import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'irish-journal.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require('fs');
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      irish TEXT NOT NULL,
      english TEXT NOT NULL,
      pronunciation TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      -- SM-2 fields
      next_review INTEGER NOT NULL DEFAULT (unixepoch()),
      ease_factor REAL NOT NULL DEFAULT 2.5,
      interval INTEGER NOT NULL DEFAULT 1,
      repetitions INTEGER NOT NULL DEFAULT 0,
      last_reviewed INTEGER
    );

    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
      quality INTEGER NOT NULL, -- 0-5 SM-2 quality rating
      reviewed_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS streak (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      last_active_date TEXT,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0
    );

    INSERT OR IGNORE INTO streak (id, last_active_date, current_streak, longest_streak)
    VALUES (1, NULL, 0, 0);
  `);
}
