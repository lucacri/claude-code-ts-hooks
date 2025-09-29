#!/usr/bin/env node

const { execSync } = require('node:child_process');

if (!process.env.CI) {
  console.error('[publish-jsr] Aborting: CI environment variable not detected.');
  process.exit(1);
}

try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim().length !== 0) {
    console.error('[publish-jsr] Working tree not clean; refusing to run JSR publish.');
    console.error(status);
    process.exit(1);
  }
} catch (error) {
  console.error('[publish-jsr] Failed to verify Git status.');
  console.error(error);
  process.exit(1);
}

try {
  execSync('npx jsr publish', { stdio: 'inherit' });
} catch (error) {
  console.error('[publish-jsr] JSR publish failed.');
  process.exit(error.status || 1);
}
