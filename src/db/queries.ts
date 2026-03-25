import { v4 as uuidv4 } from "uuid";
import { getDb } from "./client";
import type {
  InstructionRow,
  SessionRow,
  SessionMessageRow,
  ChildSessionRow,
  SessionStatus,
  TriggerSource,
  MessageRole,
} from "./types";

export interface CreateInstructionInput {
  id?: string;
  name: string;
  systemPrompt: string;
  metadata?: Record<string, unknown>;
}

export function createInstruction(
  input: CreateInstructionInput,
): InstructionRow {
  const db = getDb();
  const id = input.id || uuidv4();
  const metadata = JSON.stringify(input.metadata ?? {});

  db.prepare(
    `
    INSERT INTO instructions (id, name, system_prompt, metadata)
    VALUES (?, ?, ?, ?)
  `,
  ).run(id, input.name, input.systemPrompt, metadata);

  return db
    .prepare("SELECT * FROM instructions WHERE id = ?")
    .get(id) as InstructionRow;
}

export function getInstruction(id: string): InstructionRow | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM instructions WHERE id = ?").get(id) as
    | InstructionRow
    | undefined;
}

export function getInstructionByName(
  name: string,
  version?: number,
): InstructionRow | undefined {
  const db = getDb();
  if (version !== undefined) {
    return db
      .prepare("SELECT * FROM instructions WHERE name = ? AND version = ?")
      .get(name, version) as InstructionRow | undefined;
  }
  return db
    .prepare(
      "SELECT * FROM instructions WHERE name = ? ORDER BY version DESC LIMIT 1",
    )
    .get(name) as InstructionRow | undefined;
}

export interface CreateSessionInput {
  id?: string;
  parentSessionId?: string;
  instructionId: string;
  triggerSource?: TriggerSource;
  parameters?: Record<string, unknown>;
  depth?: number;
}

export function createSession(input: CreateSessionInput): SessionRow {
  const db = getDb();
  const id = input.id || uuidv4();
  const parameters = JSON.stringify(input.parameters ?? {});
  const triggerSource = input.triggerSource ?? "http";
  const depth = input.depth ?? 0;

  db.prepare(
    `
    INSERT INTO sessions (id, parent_session_id, instruction_id, trigger_source, parameters, depth)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.parentSessionId ?? null,
    input.instructionId,
    triggerSource,
    parameters,
    depth,
  );

  const session = db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(id) as SessionRow;

  if (input.parentSessionId) {
    db.prepare(
      `
      INSERT OR IGNORE INTO child_sessions (parent_id, child_id)
      VALUES (?, ?)
    `,
    ).run(input.parentSessionId, id);
  }

  return session;
}

export function updateSession(
  id: string,
  patch: Partial<{
    status: SessionStatus;
    result: string;
    error: string;
    startedAt: string;
    completedAt: string;
  }>,
): SessionRow {
  const db = getDb();
  const sets: string[] = [];
  const values: unknown[] = [];

  if (patch.status !== undefined) {
    sets.push("status = ?");
    values.push(patch.status);
  }
  if (patch.result !== undefined) {
    sets.push("result = ?");
    values.push(patch.result);
  }
  if (patch.error !== undefined) {
    sets.push("error = ?");
    values.push(patch.error);
  }
  if (patch.startedAt !== undefined) {
    sets.push("started_at = ?");
    values.push(patch.startedAt);
  }
  if (patch.completedAt !== undefined) {
    sets.push("completed_at = ?");
    values.push(patch.completedAt);
  }

  if (sets.length > 0) {
    values.push(id);
    db.prepare(`UPDATE sessions SET ${sets.join(", ")} WHERE id = ?`).run(
      ...values,
    );
  }

  return db
    .prepare("SELECT * FROM sessions WHERE id = ?")
    .get(id) as SessionRow;
}

export function getSession(id: string): SessionRow | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM sessions WHERE id = ?").get(id) as
    | SessionRow
    | undefined;
}

export function getChildren(parentId: string): SessionRow[] {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT s.* FROM sessions s
    INNER JOIN child_sessions cs ON s.id = cs.child_id
    WHERE cs.parent_id = ?
    ORDER BY s.created_at ASC
  `,
    )
    .all(parentId) as SessionRow[];
}

export function addSessionMessage(input: {
  id?: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  tokens?: number;
}): SessionMessageRow {
  const db = getDb();
  const id = input.id || uuidv4();
  const tokens = input.tokens ?? 0;

  db.prepare(
    `
    INSERT INTO session_messages (id, session_id, role, content, tokens)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(id, input.sessionId, input.role, input.content, tokens);

  return db
    .prepare("SELECT * FROM session_messages WHERE id = ?")
    .get(id) as SessionMessageRow;
}

export function getSessionMessages(sessionId: string): SessionMessageRow[] {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT * FROM session_messages
    WHERE session_id = ?
    ORDER BY created_at ASC
  `,
    )
    .all(sessionId) as SessionMessageRow[];
}
