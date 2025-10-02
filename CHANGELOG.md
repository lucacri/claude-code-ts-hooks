## [2.1.1](https://github.com/lucacri/claude-code-ts-hooks/compare/v2.1.0...v2.1.1) (2025-10-02)

### Bug Fixes

* regenerate package-lock.json for CI dependency caching ([6f5a6ca](https://github.com/lucacri/claude-code-ts-hooks/commit/6f5a6ca32067d3027f3ecdd27f0f73f44d745256))
* remove automatic git hooks installation during package install ([f8e4891](https://github.com/lucacri/claude-code-ts-hooks/commit/f8e4891e7924e1813ee54f598e65040c21405346))

## [2.1.0](https://github.com/lucacri/claude-code-ts-hooks/compare/v2.0.1...v2.1.0) (2025-10-01)

### Features

* migrate from npm:zod to jsr:@zod/zod for Deno ([66bfe30](https://github.com/lucacri/claude-code-ts-hooks/commit/66bfe30b5866e0d696c32f8127227abca44687df))

### Bug Fixes

* add explicit type annotations for JSR slow type compliance ([b66757e](https://github.com/lucacri/claude-code-ts-hooks/commit/b66757e54446f9dd7fab6153a3f4dac8901fa3b3))
* improve coverage to 100% functions and configure coverage scope ([2e81557](https://github.com/lucacri/claude-code-ts-hooks/commit/2e815577aebdbae74e6a9c3189b0987fd53082da))
* resolve stdin reading race condition for Deno and Bun runtimes ([7644279](https://github.com/lucacri/claude-code-ts-hooks/commit/76442795c3a9c6cb2300d7cdb0342dffbc5bde96))

## [2.0.1](https://github.com/lucacri/claude-code-ts-hooks/compare/v2.0.0...v2.0.1) (2025-09-30)

### Bug Fixes

* enforce zero ESLint warnings and add justifications for necessary any types ([7007103](https://github.com/lucacri/claude-code-ts-hooks/commit/7007103d45a4e151d8c5f40cdbb759acd22868de))

## [2.0.0](https://github.com/lucacri/claude-code-ts-hooks/compare/v1.6.0...v2.0.0) (2025-09-30)

### ⚠ BREAKING CHANGES

* The release process now automatically synchronizes deno.json version with package.json. This ensures version consistency between npm and JSR (Deno) package registries.

- Add sync-deno-version.js script to copy version from package.json to deno.json
- Update release.config.js to run sync script before git commit
- Add deno.json to semantic-release git assets for automatic versioning
- Align deno.json version to current package.json version (1.6.0)

This eliminates version drift between npm and JSR registries.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

### Features

* **hooks:** add branch sync check to pre-commit ([5a865b9](https://github.com/lucacri/claude-code-ts-hooks/commit/5a865b9e9fc9d16b5d99fbac70dc1b1638982597))
* synchronize deno.json version with semantic-release workflow ([82b34cb](https://github.com/lucacri/claude-code-ts-hooks/commit/82b34cb4dd83877758cf763d499d6b5d9b37f89b))

## [1.6.0](https://github.com/lucacri/claude-code-ts-hooks/compare/v1.5.0...v1.6.0) (2025-09-30)

### Features

* **hooks:** add automated pre-commit quality checks ([4470f33](https://github.com/lucacri/claude-code-ts-hooks/commit/4470f3364eec50166e3965e6c1e8564d9b19c444))

## [1.5.0](https://github.com/lucacri/claude-code-ts-hooks/compare/v1.4.0...v1.5.0) (2025-09-30)

### Features

* complete alignment with Anthropic hooks documentation ([df447e0](https://github.com/lucacri/claude-code-ts-hooks/commit/df447e00ac69e07e8b5bf60e44e0f071162e4466))

## [1.4.0](https://github.com/lucacri/claude-code-ts-hooks/compare/v1.3.0...v1.4.0) (2025-09-29)

### Features

* add comprehensive runtime information utility ([11aed34](https://github.com/lucacri/claude-code-ts-hooks/commit/11aed3491ef9f8bb353ad30113fe0a47062d0265))

## [1.2.0](https://github.com/lucacri/claude-code-ts-hooks/compare/v1.1.2...v1.2.0) (2025-09-29)

### Features

* add Deno runtime support and patch management system ([1771ed2](https://github.com/lucacri/claude-code-ts-hooks/commit/1771ed2a7b756a4ad4c5b100aa200b1ba0d9e18a))

### Bug Fixes

* publish unscoped package with rollup fallback ([0589d7f](https://github.com/lucacri/claude-code-ts-hooks/commit/0589d7fed22c2b20a7c3eefa46e7f69eff650c06))
* **test:** exclude .panda directory from vitest execution ([a1b9e71](https://github.com/lucacri/claude-code-ts-hooks/commit/a1b9e718bacf61446c73d7226fe2372ca3ccfe1c))

## [1.1.2](https://github.com/lucacri/claude-code-ts-hooks/compare/v1.1.1...v1.1.2) (2025-09-27)

### Notes

* **package:** Clarified that the first public npm release ships unscoped as `claude-code-ts-hooks`, while Deno/JSR stay scoped as `@lucacri/claude-code-ts-hooks` to match earlier planning.

### Bug Fixes

* **schemas:** add explicit type annotations for JSR compliance ([2b5cbaf](https://github.com/lucacri/claude-code-ts-hooks/commit/2b5cbafd319e754f7b52df62716eec02a3745bc1))

## [1.1.1](https://github.com/lucacri/claude-code-ts-hooks/compare/v1.1.0...v1.1.1) (2025-09-27)

### Bug Fixes

* lower branches coverage threshold to 70% for realistic targets ([5ccde5f](https://github.com/lucacri/claude-code-ts-hooks/commit/5ccde5ff55d97c91024960a09b38a25b84d45619))

## [1.1.0](https://github.com/lucacri/claude-code-ts-hooks/compare/v1.0.0...v1.1.0) (2025-09-27)

### Features

* drop Node.js 18.x and adjust test coverage thresholds ([8d1a50b](https://github.com/lucacri/claude-code-ts-hooks/commit/8d1a50b1a31fee9e9db7bde940eb07c6b1339eca))

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
