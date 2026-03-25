# Deepgent

LLM session coordinator with multi-agent DAG orchestration. Deepgent manages LLM-driven agent sessions with support for sub-agent spawning, parallel execution, and real-time streaming.

## Features

- **Multi-Agent Sessions**: Spawn child agents from parent sessions, building DAGs of coordinated tasks
- **Parallel Execution**: Child sessions run concurrently via Promise.all
- **Streaming**: SSE and WebSocket support for real-time token streaming
- **Multiple Triggers**: HTTP API, CLI, message queue (BullMQ), and cron scheduled sessions
- **Provider Agnostic**: Works with OpenAI-compatible APIs (OpenAI, Ollama, Anthropic via proxy, etc.)
- **Persistence**: SQLite-backed session state and message history

## Quick Start

```bash
npm install
npm run dev
```

## Architecture

```
src/
  db/           SQLite schema and migrations
  instructions/ Versioned custom instruction sets
  sessions/     Session lifecycle management
  agents/       Agent runner and DAG coordination
  providers/    LLM provider abstraction
  triggers/     HTTP, CLI, queue, cron trigger handlers
  streaming/    SSE and WebSocket streaming
  types/        Shared TypeScript types
  index.ts      Entry point
```

## Usage

### Create a session via HTTP

```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{"instructionId": "my-instruction", "parameters": {"topic": "AI"}}'
```

### CLI

```bash
npx ts-node bin/deepgent.ts session run --instruction my-instruction --params '{"topic": "AI"}'
```
