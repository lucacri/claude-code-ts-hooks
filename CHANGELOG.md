# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-09-21

### Added
- Complete TypeScript type definitions for all Claude Code hook events
- Runtime validation using Zod schemas for all hook inputs and outputs
- Utility functions for creating and managing hook handlers
- Type guards for runtime type checking and safe type narrowing
- Helper functions for common hook patterns (logging, timeout, execution)
- Comprehensive documentation with usage examples
- Integration examples showing how to use with Claude Code SDK
- Support for all hook events:
  - PreToolUse - Before tool execution
  - PostToolUse - After tool execution  
  - Stop - When Claude finishes responding
  - UserPromptSubmit - When user submits a prompt
  - Notification - System notifications
  - SubagentStop - When subagent stops
  - PreCompact - Before conversation compaction
- Modern TypeScript build with dual CJS/ESM output
- Full type safety with TypeScript 5.0+ support

### Features
- ✅ Complete type coverage for Claude Code hooks API
- ✅ Runtime validation with detailed error messages
- ✅ Hook handler creation with type safety
- ✅ Hook registry management
- ✅ Execution helpers with error handling
- ✅ Middleware support (logging, timeout)
- ✅ Integration with @anthropic-ai/claude-code package
- ✅ Comprehensive documentation and examples