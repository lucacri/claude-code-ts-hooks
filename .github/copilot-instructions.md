# AI Coding Agent Instructions for claude-code-ts-hooks

This project provides cross-platform TypeScript types and utilities for Claude Code hooks, supporting Node.js, Deno, and Bun. Follow these guidelines to be productive and maintain consistency:

## Architecture & Key Components
- **src/** contains all core logic:
  - `index.ts`: Main entry point, exports core APIs
  - `run-hook.ts`: Hook runner implementation
  - `hooks/`: Individual hook event handlers and helpers
  - `schemas/`: Zod schemas for input/output validation
  - `types/`: TypeScript type definitions for hooks, payloads, responses
  - `utils/`: Cross-platform runtime detection, validation, and helpers
- **examples/**: Usage demos for Node.js, Deno, and Bun. Reference these for platform-specific patterns.

## Developer Workflows
- **Node.js**: Build and test using npm/yarn/pnpm. No build step required for Deno/Bun.
- **Testing**: Use [Vitest](https://vitest.dev/) for unit tests. Run with `npx vitest` or `npm test`.
- **Deno/Bun**: Run hooks directly from source. See `examples/simple-hooks-deno.ts` and `examples/simple-hooks-bun.ts`.
- **Validation**: All hook inputs/outputs are validated with Zod schemas in `src/schemas/`.

## Project-Specific Patterns
- **Type Safety**: Always use types from `src/types/` for hook handlers and payloads.
- **Runtime Detection**: Use `detectRuntime`, `getArgs`, and `getEnv` from `src/utils/` for cross-platform compatibility.
- **Logging**: Use the `log` utility for consistent output across platforms.
- **Zero-config**: Deno and Bun require no build step; import directly from `src/`.
- **Hook Registration**: Use `runHook(handlers)` with a `HookHandlers` object. See examples for structure.

## Integration Points
- **Claude Code SDK**: Types and patterns align with [Claude Code SDK](https://docs.claude.com/en/docs/claude-code/sdk/sdk-typescript.md).
- **External Dependencies**: Zod for validation, Vitest for testing. Minimal runtime dependencies for portability.

## Conventions
- Prefer named exports; avoid default exports.
- Keep platform-specific logic isolated in `utils/`.
- Place new hook types in `src/types/` and update schemas in `src/schemas/`.
- Add new examples in `examples/` for each supported runtime.

## Example: Registering a Hook
```typescript
import { runHook, log, type HookHandlers } from './src/index.ts';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    log(`About to use tool: ${payload.tool_name}`);
    return { decision: 'approve' };
  },
  stop: async (payload) => {
    log('🎉 Task completed!');
    return {};
  }
};

runHook(handlers);
```

Refer to `README.md` and `examples/` for more details. If any conventions or workflows are unclear, ask for clarification or request more examples.