# claude-code-ts-hooks

**TypeScript types and utilities for Claude Code hooks** - Providing type safety and runtime validation for hook implementations.

[![npm version](https://badge.fury.io/js/claude-code-ts-hooks.svg)](https://badge.fury.io/js/claude-code-ts-hooks)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This package provides comprehensive TypeScript support for [Claude Code](https://docs.claude.com/en/docs/claude-code/sdk/sdk-typescript.md) hooks, enabling developers to write type-safe hook implementations with runtime validation. It includes:

- **Complete type definitions** for all Claude Code hook events
- **Runtime validation** using Zod schemas
- **Utility functions** for creating and managing hooks
- **Type guards** for runtime type checking
- **Helper functions** for common hook patterns

## Installation

```bash
npm install claude-code-ts-hooks
# or
yarn add claude-code-ts-hooks
# or
pnpm add claude-code-ts-hooks
```

## Quick Start

```typescript
import { 
  createHookHandler, 
  validateHookInput, 
  HookEventName,
  createHookOutput 
} from 'claude-code-ts-hooks';

// Create a type-safe PreToolUse hook handler
const preToolUseHandler = createHookHandler(HookEventName.PreToolUse, async (input) => {
  console.log(`About to use tool: ${input.tool_name}`);
  
  // Type-safe access to tool_input
  console.log('Tool parameters:', input.tool_input);
  
  // Return type-safe output
  return createHookOutput.approve('Tool usage approved');
});

// Validate hook input at runtime
const result = validateHookInput(someUnknownInput);
if (result.success) {
  console.log('Valid hook input:', result.data);
} else {
  console.error('Invalid input:', result.error);
}
```

## Hook Types

### Supported Hook Events

| Hook Event | Description | Input Type | Output Type |
|------------|-------------|------------|-------------|
| `PreToolUse` | Before tool execution | `PreToolUseHookInput` | `PreToolUseHookOutput` |
| `PostToolUse` | After tool execution | `PostToolUseHookInput` | `PostToolUseHookOutput` |
| `Stop` | When Claude finishes | `StopHookInput` | `StopHookOutput` |
| `UserPromptSubmit` | When user submits prompt | `UserPromptSubmitHookInput` | `UserPromptSubmitHookOutput` |
| `Notification` | System notifications | `NotificationHookInput` | `NotificationHookOutput` |
| `SubagentStop` | When subagent stops | `SubagentStopHookInput` | `SubagentStopHookOutput` |
| `PreCompact` | Before compaction | `PreCompactHookInput` | `PreCompactHookOutput` |

### Hook Input Structure

All hook inputs extend `BaseHookInput`:

```typescript
interface BaseHookInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
}
```

Example `PreToolUseHookInput`:

```typescript
interface PreToolUseHookInput extends BaseHookInput {
  hook_event_name: 'PreToolUse';
  tool_name: string;
  tool_input: Record<string, unknown>;
}
```

### Hook Output Structure

All hook outputs extend `BaseHookOutput`:

```typescript
interface BaseHookOutput {
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
}
```

## Usage Examples

### 1. Creating Hook Handlers

```typescript
import { 
  createHookHandler, 
  createHookOutput,
  withLogging,
  withTimeout,
  HookEventName 
} from 'claude-code-ts-hooks';

// Basic hook handler
const stopHook = createHookHandler(HookEventName.Stop, async (input) => {
  console.log('Claude finished processing');
  return createHookOutput.success();
});

// Hook with logging
const loggedHandler = withLogging(
  createHookHandler(HookEventName.UserPromptSubmit, async (input) => {
    console.log('User prompt:', input.prompt);
    return createHookOutput.success();
  })
);

// Hook with timeout
const timedHandler = withTimeout(
  createHookHandler(HookEventName.PreToolUse, async (input) => {
    // Some async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return createHookOutput.approve();
  }),
  5000 // 5 second timeout
);
```

### 2. Hook Registry

```typescript
import { createHookRegistry, createHookHandler, HookEventName } from 'claude-code-ts-hooks';

// Create multiple handlers
const handlers = [
  createHookHandler(HookEventName.PreToolUse, async (input) => {
    // Validate tool usage
    if (input.tool_name === 'dangerous_tool') {
      return createHookOutput.deny('Tool not allowed');
    }
    return createHookOutput.approve();
  }),
  
  createHookHandler(HookEventName.PostToolUse, async (input) => {
    // Log tool usage
    console.log(`Tool ${input.tool_name} completed`);
    return createHookOutput.success();
  }),
  
  createHookHandler(HookEventName.Stop, async (input) => {
    // Play completion sound or notification
    console.log('🎵 Task completed!');
    return createHookOutput.success();
  })
];

// Create registry
const hookRegistry = createHookRegistry(handlers);
```

### 3. Input Validation

```typescript
import { 
  validateHookInput, 
  parseHookInput, 
  isPreToolUseInput,
  HookEventName 
} from 'claude-code-ts-hooks';

// General validation
const result = validateHookInput(unknownInput);
if (result.success) {
  console.log('Hook event:', result.data.hook_event_name);
  
  // Use type guards for specific handling
  if (isPreToolUseInput(result.data)) {
    console.log('Tool name:', result.data.tool_name);
  }
}

// Specific event validation
const preToolResult = parseHookInput(unknownInput, HookEventName.PreToolUse);
if (preToolResult.success) {
  // TypeScript knows this is PreToolUseHookInput
  console.log('Tool:', preToolResult.data.tool_name);
  console.log('Input:', preToolResult.data.tool_input);
}
```

### 4. Error Handling

```typescript
import { executeHook, createHookHandler, HookEventName } from 'claude-code-ts-hooks';

const handler = createHookHandler(HookEventName.PreToolUse, async (input) => {
  // Potentially failing operation
  if (Math.random() > 0.5) {
    throw new Error('Random failure');
  }
  return createHookOutput.approve();
});

// Execute with error handling
const result = await executeHook(handler, input);
if (result.success) {
  console.log('Hook completed in', result.duration, 'ms');
} else {
  console.error('Hook failed:', result.error?.message);
}
```

### 5. Integration with Claude Code

```typescript
import { query } from '@anthropic-ai/claude-code';
import { 
  validateHookInput, 
  isPreToolUseInput, 
  createHookOutput,
  HookEventName 
} from 'claude-code-ts-hooks';

// In your Claude Code application
for await (const message of query({
  prompt: "Help me write a function",
  options: {
    canUseTool: async (toolName, toolInput) => {
      // Create hook input
      const hookInput = {
        session_id: 'current-session',
        transcript_path: '/path/to/transcript',
        hook_event_name: HookEventName.PreToolUse,
        tool_name: toolName,
        tool_input: toolInput
      };
      
      // Validate and process
      const validation = validateHookInput(hookInput);
      if (validation.success && isPreToolUseInput(validation.data)) {
        // Your hook logic here
        console.log(`Requesting permission for ${toolName}`);
        
        return {
          behavior: 'allow',
          updatedInput: toolInput
        };
      }
      
      return {
        behavior: 'deny',
        message: 'Invalid hook input'
      };
    }
  }
})) {
  console.log(message);
}
```

## API Reference

### Types

- **Input Types**: `PreToolUseHookInput`, `PostToolUseHookInput`, `StopHookInput`, etc.
- **Output Types**: `PreToolUseHookOutput`, `PostToolUseHookOutput`, `StopHookOutput`, etc.
- **Handler Types**: `HookHandler`, `HookHandlerFor`, `HookRegistry`
- **Utility Types**: `ToolInput`, `ToolResponse`, `HookEventName`, `HookConfig`

### Validation Functions

- `validateHookInput(input)` - Validate any hook input
- `validateHookOutput(output)` - Validate any hook output
- `parseHookInput(input, eventName)` - Parse and validate specific event input
- `safeParseJSON(jsonString)` - Safely parse JSON with validation

### Type Guards

- `isHookInputOfType(input, eventName)` - Generic type guard
- `isPreToolUseInput(input)` - Specific type guards for each event
- `isHookEventName(value)` - Check if value is valid event name

### Helper Functions

- `createHookHandler(eventName, handler)` - Create type-safe handler
- `createHookRegistry(handlers)` - Create handler registry
- `executeHook(handler, input, context)` - Execute with error handling
- `withLogging(handler, logger)` - Add logging to handler
- `withTimeout(handler, timeout)` - Add timeout to handler
- `createHookOutput.success()` - Create success output
- `createHookOutput.block(reason)` - Create blocking output

## TypeScript Configuration

This package is built with TypeScript 5.0+ and uses modern features. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Related

- [Claude Code SDK](https://docs.claude.com/en/docs/claude-code/sdk/sdk-typescript.md) - Official Claude Code TypeScript SDK
- [Zod](https://zod.dev/) - TypeScript-first schema validation library

---

Made with ❤️ for the Claude Code community
