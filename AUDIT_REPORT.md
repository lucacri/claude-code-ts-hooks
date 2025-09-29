# Repository Audit Report — claude-code-ts-hooks

**Date:** September 28, 2025  
**Auditor:** Code (multi-agent synthesis)

## Scope & Method
- Full repository inspection for committed credentials, private data, and binary artefacts.
- Review of distribution configuration (`package.json`, `deno.json`, `jsr.json`, `release.config.js`) and tooling scripts.
- Static secret scan via ripgrep against common token patterns.
- Packaging check using `npm pack --dry-run` to confirm published payload.

## Key Findings
### Security
- No committed secrets discovered; matches confined to CI placeholder variables and type definitions (`.github/workflows/*.yml`, `release.config.js`, `src/types/sdk.ts`).
- No PEM/key material present; large-file scan limited to installed dependencies inside `node_modules/` (untracked).

### Distribution & Hygiene
- Version skew identified: the public API constant and JSR metadata still reported `1.0.0` while `package.json` was `1.1.2`.  
  → Corrected in `src/index.ts:74` and `jsr.json:3` to keep runtime/version metadata in sync.
- `postinstall` previously invoked `patch-package` unconditionally. Because `patch-package` lives in `devDependencies`, downstream installs would fail when the binary is absent.  
  → Replaced with a guarded Node script (`package.json:40`, `scripts/apply-patches.js`) that only runs when the tool is available.
- `npm pack --dry-run` confirms the tarball now contains the guard script but no extra build artefacts or secrets.
- Repository now standardises on npm for dependency locking; `yarn.lock` removed to avoid dual lockfile drift.
- NPM package payload trimmed by excluding `examples/` from the published files list (`package.json:18`).

### Release Tooling Observations
- JSR publishing now runs through a CI-and-clean-tree guard (`scripts/publish-jsr.js`) invoked from `release.config.js`, preventing accidental local publishes.
- Rollup patch maintenance guidelines captured in `docs/rollup-patch-maintenance.md` to keep the WASM fallback aligned with future upgrades.

## Remediation Actions Implemented
1. Updated exported library version constant to `1.1.2` for parity with npm metadata (`src/index.ts:74`).
2. Synced `jsr.json` version field to `1.1.2`.
3. Added `scripts/apply-patches.js` and changed `postinstall` to call it safely so consumers without devDependencies do not break (`package.json:40`, `scripts/apply-patches.js`).
4. Excluded `examples/` from the published npm payload to keep tarballs lean (`package.json:18`).
5. Removed `yarn.lock` to standardise on npm's lockfile for dependency resolution.
6. Added `scripts/publish-jsr.js` and updated release automation to require CI + clean tree before running `jsr publish` (`release.config.js:22`).

## Verification
- Secret scan: `rg --hidden --line-number --ignore-case '(?i)(api[_-]?key|secret|token|password|aws_access_key_id|aws_secret_access_key|ghp_[0-9a-zA-Z]{36}|sk_live|sk_test|-----BEGIN|PRIVATE KEY)'` (no sensitive hits beyond expected configuration references).
- Packaging: `npm pack --dry-run` to inspect final tarball contents (confirmed minimal payload, includes new guard script).
- Tests: `npm test` (Vitest) to ensure functional parity after configuration changes.

## Outstanding Recommendations
None at this time.

---
This report reflects repository state as inspected on September 28, 2025. No secrets or critical security issues were found; remediation focused on distribution hygiene and safe tooling defaults.
