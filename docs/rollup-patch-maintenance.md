# Rollup WASM Fallback Patch Maintenance

The project keeps Rollup functional on platforms without native binaries by shipping a `patch-package` override stored at `patches/rollup+4.52.0.patch`. The patch wraps Rollup's native binding loader (`node_modules/rollup/dist/native.js`) in a `try/catch` that falls back to `@rollup/wasm-node`. Any Rollup upgrade must preserve that behaviour.

## Current pairing
| Rollup version | Patch file | WASM fallback package | Notes |
| --- | --- | --- | --- |
| 4.52.0 | `patches/rollup+4.52.0.patch` | `@rollup/wasm-node@4.52.0` | Aligned as of September 29, 2025 |

Update the table whenever Rollup (directly or through a dependency such as `tsup`) changes, or when the fallback dependency needs a version bump.

## When to refresh or remove the patch
- **Rollup version change:** Whenever `npm ls rollup` reports a new version, assume the patch must be regenerated.
- **Fallback divergence:** If `@rollup/wasm-node` publishes a matching release that differs from the pinned version, refresh both the dependency and the patch together.
- **Upstream fix:** Remove the patch only after verifying Rollup ships an equivalent WASM fallback. Delete the patch file, drop the extra dependency, and update this document.
- **Patch drift:** If `scripts/apply-patches.js` fails during install, regenerate the patch before merging any dependency changes.

## Regenerating the patch after a Rollup upgrade
1. **Install the upgraded Rollup version**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm ls rollup
   ```
   Confirm the final command prints the expected version.
2. **Align the WASM fallback**
   - Set `@rollup/wasm-node` in `package.json` to the same version as Rollup (matching major/minor).
   - Run `npm install` again if you touched `package.json`.
3. **Patch the installed file**
   Edit `node_modules/rollup/dist/native.js` so the loader block looks like:
   ```js
   let bindings;
   try {
     bindings = requireWithFriendlyError(
       existsSync(path.join(__dirname, localName)) ? localName : `@rollup/rollup-${packageBase}`
     );
   } catch (error) {
     try {
       bindings = require('@rollup/wasm-node');
     } catch {
       throw error;
     }
   }
   const { parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } = bindings;
   ```
   Leave the rest of the file untouched.
4. **Regenerate the patch**
   ```bash
   npx patch-package rollup
   ```
   Remove any superseded `patches/rollup+<old>.patch` files.
5. **Review tooling**
   - Ensure `scripts/apply-patches.js` needs no adjustments.
   - Update lockfiles and this document (table and dates) before committing.

## Validating the WASM fallback
1. **Clean reinstall**
   ```bash
   rm -rf node_modules
   npm install
   ```
   Confirm the postinstall hook shows the Rollup patch being applied.
2. **Simulate missing native bindings**
   ```bash
   PLATFORM_DIR=$(node -e "const path=require('node:path'); const fs=require('node:fs'); const native=require('rollup/dist/native.js'); const base=native.getPackageBase?native.getPackageBase():require('rollup/package.json').rollup.platformAndArch; const dir=path.join('node_modules','@rollup',`rollup-${base}`); if(!fs.existsSync(dir)){console.log(dir); process.exit(0);} fs.renameSync(dir, `${dir}.bak`); console.log(dir);")
   node -e "require('rollup/dist/native.js'); console.log('Loaded Rollup via WASM fallback');"
   [[ -n "$PLATFORM_DIR" && -d "${PLATFORM_DIR}.bak" ]] && mv "${PLATFORM_DIR}.bak" "$PLATFORM_DIR"
   ```
   The require call must succeed and print the confirmation message.
3. **Smoke test bundling**
   ```bash
   echo "export default 1;" > /tmp/rollup-entry.js
   npx rollup /tmp/rollup-entry.js --format esm --file /tmp/rollup-out.mjs
   rm /tmp/rollup-entry.js /tmp/rollup-out.mjs
   ```
   This ensures Rollup still bundles using the fallback implementation.
4. **Project checks**
   Run `npm test` (or `npm run ci` if broader coverage is needed) to confirm nothing else regressed.

## Pull request checklist
- [ ] `patches/rollup+<version>.patch` reflects the loader snippet above.
- [ ] `@rollup/wasm-node` matches the Rollup version in `package-lock.json`.
- [ ] `npm install` succeeds with the patch applied.
- [ ] Native binary simulation and smoke bundling succeeded (note results in the PR body).
- [ ] Table and guidance in `docs/rollup-patch-maintenance.md` updated for the new release.

Keep this document in sync with each Rollup upgrade so future maintainers can repeat the process without rediscovering the WASM fallback details.
