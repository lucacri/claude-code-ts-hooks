## 1.0.0 (2025-09-27)

### ⚠ BREAKING CHANGES

* Release process now uses semantic-release exclusively for both NPM and JSR publishing

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

### Features

* configure dual NPM and JSR publishing workflow ([8e6e39e](https://github.com/lucacri/claude-code-ts-hooks/commit/8e6e39e467a81b04db9b0a17ac4884f66bd73baa))
* migrate to JSR and add passthrough to hook schemas ([6b2f3ea](https://github.com/lucacri/claude-code-ts-hooks/commit/6b2f3ea05d013c3f7ddc78e4f2a0b7671729105a))
* **runtime:** add dual Node.js/Deno compatibility with standardized imports ([5fe0ce4](https://github.com/lucacri/claude-code-ts-hooks/commit/5fe0ce40fadd2e1971e3f88b15f461b2eed69a49))
* **schemas:** remove passthrough() from hook input and output schemas ([9948c04](https://github.com/lucacri/claude-code-ts-hooks/commit/9948c0432d83257173b4fc586c6536014882ce70))
* scope package to @lucacri/claude-code-ts-hooks with GitHub Packages support ([c4b6599](https://github.com/lucacri/claude-code-ts-hooks/commit/c4b6599984d8c656135cd67211eb2a37377540c2))

### Bug Fixes

* add conventional-changelog-conventionalcommits dependency ([fe141f8](https://github.com/lucacri/claude-code-ts-hooks/commit/fe141f8fd6684f7f9890cc95ac4bdb996ac3c6b5))
* standardize zod import paths to 'zod' ([402b374](https://github.com/lucacri/claude-code-ts-hooks/commit/402b37421cb3cd6fa461e8c92d45f9df22e8b8cb))
* update semantic-release config to handle invalid timestamps ([0785ec7](https://github.com/lucacri/claude-code-ts-hooks/commit/0785ec7060f1a73928768af13e99d2ca04161bb7))

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
