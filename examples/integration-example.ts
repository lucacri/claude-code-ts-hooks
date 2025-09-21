/**
 * Integration example showing how to use claude-code-ts-hooks with the Claude Code SDK
 */

import {
  createHookHandler,
  validateHookInput,
  createHookOutput,
  isPreToolUseInput,
  type PermissionResult,
  type ClaudeCodeOptions,
} from 'claude-code-ts-hooks';

// Example: Custom permission handler that uses hooks
class HookBasedPermissionHandler {
  private preToolUseHandler = createHookHandler('PreToolUse', async (input) => {
    console.log(`🔍 Evaluating tool: ${input.tool_name}`);
    
    // Example: Block file system operations in sensitive directories
    if (input.tool_name === 'write_file' || input.tool_name === 'read_file') {
      const path = input.tool_input.path as string;
      if (path?.includes('/etc/') || path?.includes('/var/')) {
        return createHookOutput.deny('Access to system directories not allowed');
      }
    }
    
    // Example: Require confirmation for certain tools
    if (input.tool_name === 'bash') {
      const command = input.tool_input.command as string;
      if (command?.includes('sudo') || command?.includes('rm -rf')) {
        return createHookOutput.deny('Dangerous commands require manual approval');
      }
    }
    
    return createHookOutput.approve('Tool usage approved');
  });

  async canUseTool(toolName: string, input: Record<string, unknown>): Promise<PermissionResult> {
    // Create hook input
    const hookInput = {
      session_id: `session-${Date.now()}`,
      transcript_path: '/tmp/current-transcript.json',
      hook_event_name: 'PreToolUse' as const,
      tool_name: toolName,
      tool_input: input,
    };

    // Validate the input
    const validation = validateHookInput(hookInput);
    if (!validation.success || !isPreToolUseInput(validation.data)) {
      return {
        behavior: 'deny',
        message: 'Invalid hook input structure',
      };
    }

    // Execute the hook handler
    try {
      const result = await this.preToolUseHandler.handler(validation.data);
      
      if (result.decision === 'block' || result.continue === false) {
        return {
          behavior: 'deny',
          message: result.reason || result.stopReason || 'Tool usage blocked by hook',
        };
      }

      return {
        behavior: 'allow',
        updatedInput: input,
      };
    } catch (error) {
      console.error('❌ Hook execution failed:', error);
      return {
        behavior: 'deny',
        message: 'Hook execution failed',
      };
    }
  }
}

// Example: Complete Claude Code options with hook-based permissions
export function createClaudeCodeOptions(): ClaudeCodeOptions {
  const permissionHandler = new HookBasedPermissionHandler();

  return {
    // Hook-based permission checking
    canUseTool: (toolName, input) => permissionHandler.canUseTool(toolName, input),
    
    // Other Claude Code options
    maxTurns: 10,
    permissionMode: 'default',
    
    // Example: Custom system prompt mentioning hook safety
    appendSystemPrompt: `
      Note: All tool usage is monitored by safety hooks that may block dangerous operations.
      If a tool is blocked, please try a safer alternative approach.
    `,
    
    // Error handling
    stderr: (data: string) => {
      console.error('Claude Code stderr:', data);
    },
  };
}

// Example: Hook-based session manager
class HookBasedSessionManager {
  private sessions = new Map<string, { 
    startTime: Date; 
    toolsUsed: string[]; 
    lastActivity: Date; 
  }>();

  private stopHandler = createHookHandler('Stop', async (input) => {
    const session = this.sessions.get(input.session_id);
    if (session) {
      const duration = Date.now() - session.startTime.getTime();
      console.log(`📈 Session ${input.session_id} completed:`);
      console.log(`  Duration: ${duration}ms`);
      console.log(`  Tools used: ${session.toolsUsed.length}`);
      console.log(`  Tools: ${session.toolsUsed.join(', ')}`);
    }
    
    // Clean up session
    this.sessions.delete(input.session_id);
    
    return createHookOutput.success();
  });

  private postToolUseHandler = createHookHandler('PostToolUse', async (input) => {
    // Track tool usage
    let session = this.sessions.get(input.session_id);
    if (!session) {
      session = {
        startTime: new Date(),
        toolsUsed: [],
        lastActivity: new Date(),
      };
      this.sessions.set(input.session_id, session);
    }

    session.toolsUsed.push(input.tool_name);
    session.lastActivity = new Date();

    console.log(`📊 Tool ${input.tool_name} completed in session ${input.session_id}`);
    
    return createHookOutput.success();
  });

  async processHookEvent(eventData: unknown): Promise<void> {
    const validation = validateHookInput(eventData);
    if (!validation.success) {
      console.error('❌ Invalid hook event:', validation.error);
      return;
    }

    const input = validation.data;
    
    try {
      switch (input.hook_event_name) {
        case 'PostToolUse':
          await this.postToolUseHandler.handler(input);
          break;
        case 'Stop':
          await this.stopHandler.handler(input);
          break;
        default:
          console.log(`ℹ️ Unhandled hook event: ${input.hook_event_name}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${input.hook_event_name} hook:`, error);
    }
  }

  getSessionStats() {
    return {
      activeSessions: this.sessions.size,
      sessions: Object.fromEntries(this.sessions),
    };
  }
}

// Example usage
export function setupIntegratedHooks() {
  const sessionManager = new HookBasedSessionManager();
  const claudeOptions = createClaudeCodeOptions();

  console.log('🚀 Integrated hook system initialized');
  console.log('📋 Features enabled:');
  console.log('  ✅ Permission-based tool filtering');
  console.log('  ✅ Session tracking and analytics');
  console.log('  ✅ Safety validation');

  return {
    sessionManager,
    claudeOptions,
  };
}

// Demo
if (require.main === module) {
  console.log('🎯 Running integration example...\n');
  
  const { sessionManager, claudeOptions } = setupIntegratedHooks();
  
  // Simulate some hook events
  console.log('\n🧪 Simulating hook events...');
  
  // Simulate a PostToolUse event
  sessionManager.processHookEvent({
    session_id: 'demo-session',
    transcript_path: '/tmp/demo-transcript.json',
    hook_event_name: 'PostToolUse',
    tool_name: 'write_file',
    tool_input: { path: './demo.txt', content: 'Hello!' },
    tool_response: { success: true },
  });

  // Simulate a Stop event
  setTimeout(() => {
    sessionManager.processHookEvent({
      session_id: 'demo-session',
      transcript_path: '/tmp/demo-transcript.json',
      hook_event_name: 'Stop',
      stop_hook_active: true,
    });
    
    console.log('\n📊 Final session stats:', sessionManager.getSessionStats());
  }, 1000);
}