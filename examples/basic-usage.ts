/**
 * Basic usage examples for claude-code-ts-hooks
 */

import {
  createHookHandler,
  createHookRegistry,
  validateHookInput,
  createHookOutput,
  withLogging,
  withTimeout,
  isPreToolUseInput,
  HookEventName,
  type PreToolUseHookInput,
  type HookRegistry,
} from 'claude-code-ts-hooks';

// Example 1: Creating a simple PreToolUse hook
const preToolUseHandler = createHookHandler(HookEventName.PreToolUse, async (input) => {
  console.log(`🔧 About to use tool: ${input.tool_name}`);
  console.log(`📋 Tool parameters:`, input.tool_input);
  
  // Approve the tool usage
  return createHookOutput.approve('Tool usage approved');
});

// Example 2: Creating a Stop hook (completion notification)
const stopHandler = createHookHandler(HookEventName.Stop, async (input) => {
  console.log('🎉 Claude has finished processing!');
  console.log(`📍 Session: ${input.session_id}`);
  
  // You could play a sound, send a notification, etc.
  return createHookOutput.success();
});

// Example 3: Creating a hook with logging
const loggedHandler = withLogging(
  createHookHandler(HookEventName.UserPromptSubmit, async (input) => {
    console.log(`👤 User submitted: ${input.prompt.substring(0, 50)}...`);
    return createHookOutput.success();
  }),
  (message, data) => console.log(`[HOOK LOG] ${message}`, data)
);

// Example 4: Creating a hook with timeout
const timedHandler = withTimeout(
  createHookHandler(HookEventName.PostToolUse, async (input) => {
    // Simulate some async work
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`✅ Tool ${input.tool_name} completed successfully`);
    return createHookOutput.success();
  }),
  5000 // 5 second timeout
);

// Example 5: Creating a hook registry
const createMyHookRegistry = (): HookRegistry => {
  return createHookRegistry([
    preToolUseHandler,
    stopHandler,
    loggedHandler,
    timedHandler,
  ]);
};

// Example 6: Validating hook input
const validateAndProcessInput = (unknownInput: unknown) => {
  const validation = validateHookInput(unknownInput);
  
  if (!validation.success) {
    console.error('❌ Invalid hook input:', validation.error);
    return;
  }
  
  const hookInput = validation.data;
  console.log(`📨 Received ${hookInput.hook_event_name} hook`);
  
  // Use type guards for specific handling
  if (isPreToolUseInput(hookInput)) {
    console.log(`🔧 Tool to use: ${hookInput.tool_name}`);
  }
};

// Example 7: Hook with conditional logic
const conditionalHandler = createHookHandler(HookEventName.PreToolUse, async (input) => {
  // Block dangerous tools
  const dangerousTools = ['rm', 'delete', 'format'];
  
  if (dangerousTools.some(tool => input.tool_name.includes(tool))) {
    return createHookOutput.deny(`Tool ${input.tool_name} is not allowed`);
  }
  
  // Log tool usage for audit
  console.log(`📊 Audit: Tool ${input.tool_name} used at ${new Date().toISOString()}`);
  
  return createHookOutput.approve();
});

// Example usage in a hypothetical Claude Code application
export const setupHooks = () => {
  const registry = createMyHookRegistry();
  
  // In a real application, you would register these hooks
  // with your Claude Code configuration
  console.log('🚀 Hook registry created with', Object.keys(registry).length, 'handlers');
  
  return registry;
};

// Example of processing incoming hook data
export const processHookEvent = (eventData: string) => {
  try {
    const parsed = JSON.parse(eventData);
    validateAndProcessInput(parsed);
  } catch (error) {
    console.error('❌ Failed to parse hook event:', error);
  }
};

// Demo function
if (require.main === module) {
  console.log('🎯 Running claude-code-ts-hooks examples...\n');
  
  // Setup hooks
  const registry = setupHooks();
  console.log('\n📋 Available hook handlers:', Object.keys(registry));
  
  // Test with sample data
  const sampleInput: PreToolUseHookInput = {
    session_id: 'example-session-123',
    transcript_path: '/tmp/example-transcript.json',
    hook_event_name: HookEventName.PreToolUse,
    tool_name: 'write_file',
    tool_input: {
      path: './example.txt',
      content: 'Hello, World!'
    }
  };
  
  console.log('\n🧪 Testing validation...');
  validateAndProcessInput(sampleInput);
  
  console.log('\n✅ Examples completed!');
}