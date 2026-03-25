import { getDb } from "./client";

export function migrate(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS instructions (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      system_prompt TEXT NOT NULL,
      metadata TEXT NOT NULL DEFAULT '{}',
      created_at DATETIME NOT NULL DEFAULT (datetime('now')),
      updated_at DATETIME NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      parent_session_id TEXT,
      instruction_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      parameters TEXT NOT NULL DEFAULT '{}',
      result TEXT,
      error TEXT,
      trigger_source TEXT NOT NULL DEFAULT 'http',
      depth INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT (datetime('now')),
      started_at DATETIME,
      completed_at DATETIME,
      FOREIGN KEY (parent_session_id) REFERENCES sessions(id),
      FOREIGN KEY (instruction_id) REFERENCES instructions(id)
    );

    CREATE TABLE IF NOT EXISTS session_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      tokens INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS child_sessions (
      parent_id TEXT NOT NULL,
      child_id TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (parent_id, child_id),
      FOREIGN KEY (parent_id) REFERENCES sessions(id),
      FOREIGN KEY (child_id) REFERENCES sessions(id)
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
    CREATE INDEX IF NOT EXISTS idx_sessions_parent ON sessions(parent_session_id);
    CREATE INDEX IF NOT EXISTS idx_session_messages_session ON session_messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_child_sessions_parent ON child_sessions(parent_id);
    CREATE INDEX IF NOT EXISTS idx_child_sessions_child ON child_sessions(child_id);
  `);
}
