import { emitAgentEvent } from '@/lib/sse';
import { sql } from '@/lib/db';
import { getModel, type ModelAlias } from '@otto/ai-core';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { createRagSearchTool } from './rag';

export interface AgentRunContext {
  runId: string;
  agentId: string;
  orgId: string;
  traceId: string;
  model: ModelAlias;
  systemPrompt: string;
  maxIterations?: number;
}

export class AgentRun {
  static async start(context: AgentRunContext, input: string) {
    const { runId, agentId, orgId, traceId, model, systemPrompt } = context;
    const maxIterations = context.maxIterations ?? 5;

    // → emit SSE: run:queued
    await emitAgentEvent({
      actionId: runId, // Reusing actionId as runId for SSE routing for now
      fromState: null,
      toState: 'run:queued',
      detail: { runId, agentId, orgId, traceId },
    });

    // → load AgentDefinition + tools + knowledge refs (Skipped: simplified for now)
    
    // → emit SSE: run:started
    await emitAgentEvent({
      actionId: runId,
      fromState: 'run:queued',
      toState: 'run:started',
      detail: { runId, traceId, model, toolCount: 0 },
    });

    const aiModel = getModel(model, {
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openrouterApiKey: process.env.OPENROUTER_API_KEY,
    });

    let iteration = 0;
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input }
    ];

    try {
      while (iteration < maxIterations) {
        iteration++;
        // → emit SSE: run:thinking
        await emitAgentEvent({
          actionId: runId,
          fromState: null,
          toState: 'run:thinking',
          detail: { runId, traceId, iteration },
        });

        const result = await generateText({
          model: aiModel,
          messages,
          tools: {
            rag_search: createRagSearchTool(orgId),
          },
        });

        // Add response to messages
        messages.push({ role: 'assistant', content: result.text });

        // If tools were called, handle them
        if (result.toolCalls && result.toolCalls.length > 0) {
          for (const call of result.toolCalls) {
            // → emit SSE: run:tool_call
            await emitAgentEvent({
              actionId: runId,
              fromState: null,
              toState: 'run:tool_call',
              detail: { runId, traceId, callId: call.toolCallId, tool: call.toolName, args: call.args, actionClass: 'draft' },
            });

            // Execute tool (mocked for now)
            const toolResult = { success: true };

            // → emit SSE: run:tool_result
            await emitAgentEvent({
              actionId: runId,
              fromState: null,
              toState: 'run:tool_result',
              detail: { runId, traceId, callId: call.toolCallId, tool: call.toolName, result: toolResult, latencyMs: 100 },
            });

            messages.push({
              role: 'tool',
              content: [{ type: 'tool-result', toolCallId: call.toolCallId, toolName: call.toolName, result: toolResult }],
            });
          }
        } else {
          // No tools called, run is complete
          // Apply safety layer
          const safetyContext = {
            plan: 'free' as const, // Hardcoded for now, should come from org
            domain: null, // Hardcoded for now, should come from agent config
          };
          
          // @ts-ignore
          const { applySafetyLayer } = await import('./safety');
          const safeResult = applySafetyLayer(result.text, safetyContext);

          // → emit SSE: run:completed
          await emitAgentEvent({
            actionId: runId,
            fromState: null,
            toState: 'run:completed',
            detail: { 
              runId, 
              traceId, 
              output: safeResult.content, 
              usage: result.usage, 
              trustDelta: 0, 
              durationMs: 0,
              safetyFlags: safeResult.flags
            },
          });
          break;
        }
      }

      if (iteration >= maxIterations) {
        // → emit SSE: run:error
        await emitAgentEvent({
          actionId: runId,
          fromState: null,
          toState: 'run:error',
          detail: { runId, traceId, code: 'MAX_ITER', message: 'Max iterations exceeded', recoverable: false },
        });
      }
    } catch (error: any) {
      // → emit SSE: run:error
      await emitAgentEvent({
        actionId: runId,
        fromState: null,
        toState: 'run:error',
        detail: { runId, traceId, code: 'ERROR', message: error.message, recoverable: false },
      });
    }
  }
}
