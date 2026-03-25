export { getDb, closeDb, setDb } from "./client";
export { migrate } from "./migrate";
export {
  createInstruction,
  getInstruction,
  getInstructionByName,
  createSession,
  updateSession,
  getSession,
  getChildren,
  addSessionMessage,
  getSessionMessages,
} from "./queries";
export type {
  InstructionRow,
  SessionRow,
  SessionMessageRow,
  ChildSessionRow,
  SessionStatus,
  TriggerSource,
  MessageRole,
} from "./types";

export type { CreateInstructionInput, CreateSessionInput } from "./queries";
