#!/usr/bin/env node

// Guarded patch-package execution so consumers without devDependencies do not fail
let patchBinaryPath;
try {
  patchBinaryPath = require.resolve('patch-package/bin/patch-package');
} catch (error) {
  if (error && error.code === 'MODULE_NOT_FOUND') {
    process.exit(0);
  }
  throw error;
}

const { spawnSync } = require('node:child_process');
const result = spawnSync(process.execPath, [patchBinaryPath], { stdio: 'inherit' });

if (result.status !== 0) {
  process.exit(result.status || 1);
}
