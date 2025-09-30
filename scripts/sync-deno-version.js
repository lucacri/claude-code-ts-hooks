#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

// Read package.json version
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Read deno.json
const denoJsonPath = path.join(process.cwd(), 'deno.json');
const denoJson = JSON.parse(fs.readFileSync(denoJsonPath, 'utf8'));

// Update deno.json version
denoJson.version = version;

// Write back to deno.json
fs.writeFileSync(denoJsonPath, JSON.stringify(denoJson, null, 2) + '\n');

console.log(`[sync-deno-version] Updated deno.json version to ${version}`);
