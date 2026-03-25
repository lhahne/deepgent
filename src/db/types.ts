export type SessionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";
export type TriggerSource = "http" | "cli" | "queue" | "cron";
export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface InstructionRow {
  id: string;
  name: string;
  version: number;
  system_prompt: string;
  metadata: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRow {
  id: string;
  parent_session_id: string | null;
  instruction_id: string;
  status: SessionStatus;
  parameters: string;
  result: string | null;
  error: string | null;
  trigger_source: TriggerSource;
  depth: number;
  created_at: string;
  started_at: string;
  completed_at: string;
}

export interface SessionMessageRow {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  tokens: number;
  created_at: string;
}

export interface ChildSessionRow {
  parent_id: string;
  child_id: string;
  created_at: string;
}
