/**
 * Claude Code SDK related types
 * These types are compatible with @anthropic-ai/claude-code package
 */

/**
 * Permission result for tool usage
 */
export type PermissionResult =
  | {
      behavior: 'allow';
      updatedInput: Record<string, unknown>;
    }
  | {
      behavior: 'deny';
      message: string;
    };

/**
 * Function type for checking tool permissions
 */
export type CanUseTool = (
  toolName: string,
  input: Record<string, unknown>
) => Promise<PermissionResult>;

/**
 * Permission modes for Claude Code
 */
export type PermissionMode =
  | 'default'
  | 'acceptEdits'
  | 'bypassPermissions'
  | 'plan';

/**
 * API key source types
 */
export type ApiKeySource = 'user' | 'project' | 'org' | 'temporary';

/**
 * Configuration scope levels
 */
export type ConfigScope = 'local' | 'user' | 'project';

/**
 * MCP server configuration types
 */
export type McpStdioServerConfig = {
  type?: 'stdio'; // Optional for backwards compatibility
  command: string;
  args?: string[];
  env?: Record<string, string>;
};

export type McpSSEServerConfig = {
  type: 'sse';
  url: string;
  headers?: Record<string, string>;
};

export type McpHttpServerConfig = {
  type: 'http';
  url: string;
  headers?: Record<string, string>;
};

export type McpServerConfig =
  | McpStdioServerConfig
  | McpSSEServerConfig
  | McpHttpServerConfig;

/**
 * Claude Code query options
 */
export interface ClaudeCodeOptions {
  abortController?: AbortController;
  allowedTools?: string[];
  appendSystemPrompt?: string;
  customSystemPrompt?: string;
  cwd?: string;
  disallowedTools?: string[];
  executable?: 'bun' | 'deno' | 'node';
  executableArgs?: string[];
  maxThinkingTokens?: number;
  maxTurns?: number;
  mcpServers?: Record<string, McpServerConfig>;
  pathToClaudeCodeExecutable?: string;
  permissionMode?: PermissionMode;
  permissionPromptToolName?: string;
  continue?: boolean;
  resume?: string;
  model?: string;
  fallbackModel?: string;
  stderr?: (data: string) => void;
  canUseTool?: CanUseTool;
}