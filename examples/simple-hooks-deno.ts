#!/usr/bin/env -S deno run --allow-read --allow-env

/**
 * Simple hook implementation for Deno runtime
 * Run with: deno run --allow-read --allow-env examples/simple-hooks-deno.ts
 */

import { runHook, log, type HookHandlers } from '../src/index.ts';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    log(`About to use tool: ${payload.tool_name}`);
    
    // Block dangerous tools
    const dangerousTools = ['rm', 'delete', 'format'];
    if (dangerousTools.some(tool => payload.tool_name.includes(tool))) {
      return {
        decision: 'block',
        reason: `Tool ${payload.tool_name} is not allowed for safety reasons`
      };
    }
    
    return {
      decision: 'approve',
      reason: 'Tool usage approved'
    };
  },

  postToolUse: async (payload) => {
    log(`Tool ${payload.tool_name} completed successfully`);
    return {};
  },

  stop: async (payload) => {
    log('🎉 Task completed! Claude has finished processing.');
    // You could play a sound, send notification, etc.
    return {};
  },

  userPromptSubmit: async (payload) => {
    log(`User submitted: ${payload.prompt.substring(0, 50)}...`);
    return {
      decision: 'approve'
    };
  },

  notification: async (payload) => {
    log(`Notification: ${payload.message}`);
    return {};
  }
};

// Run the hooks
runHook(handlers);