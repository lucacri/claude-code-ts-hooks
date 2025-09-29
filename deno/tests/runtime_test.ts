/// <reference lib="deno.ns" />

import { assertEquals, assertExists } from "jsr:@std/assert";

import { createHookOutput, createHookConfig } from "../../src/hooks/helpers.ts";
import { detectRuntime, getEnv } from "../../src/utils/runtime.ts";
import { HookEventName } from "../../src/types/base.ts";

Deno.test("detectRuntime identifies deno runtime", () => {
  assertEquals(detectRuntime(), "deno");
});

Deno.test("getEnv reads environment variables", () => {
  const key = "CLAUDE_CODE_DENO_TEST";
  Deno.env.set(key, "ok");
  try {
    assertEquals(getEnv(key), "ok");
  } finally {
    Deno.env.delete(key);
  }
});

Deno.test("createHook helpers return zod-safe objects", () => {
  const config = createHookConfig({
    event: HookEventName.PreToolUse,
    command: "deno-test",
    description: "ensures Deno compatibility",
  });
  assertEquals(config.event, "PreToolUse");
  assertEquals(config.command, "deno-test");
  assertExists(config.description);

  const output = createHookOutput.success();
  assertEquals(output.continue, true);
  assertEquals(output.stopReason, undefined);
});
