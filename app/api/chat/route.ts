import Anthropic from '@anthropic-ai/sdk';
import { TOOL_DEFINITIONS, createToolContext, executeTool } from '@/lib/ai/tools';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { QuizData } from '@/types/quiz';
import { EligibilityResult } from '@/types/benefit';

const MAX_TOOL_ROUNDS = 5;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY not configured. Add it to .env.local to enable AI advisor.' },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { messages, quizData, results } = body as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    quizData: QuizData;
    results: EligibilityResult[];
  };

  if (!messages || !quizData) {
    return Response.json({ error: 'Missing messages or quizData' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt(quizData, results || []);
  const toolCtx = createToolContext(quizData, results);

  // Convert our message format to Anthropic format
  const anthropicMessages: Anthropic.MessageParam[] = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  // Stream with tool use loop
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let currentMessages = [...anthropicMessages];
        let toolRounds = 0;

        while (toolRounds < MAX_TOOL_ROUNDS) {
          const response = await client.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 1024,
            system: systemPrompt,
            tools: TOOL_DEFINITIONS as any,
            messages: currentMessages,
          });

          // Check if we need to handle tool use
          const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
          const textBlocks = response.content.filter(b => b.type === 'text');

          // Stream any text blocks
          for (const block of textBlocks) {
            if (block.type === 'text') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: block.text })}\n\n`));
            }
          }

          // If no tool calls, we're done
          if (toolUseBlocks.length === 0 || response.stop_reason !== 'tool_use') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
            break;
          }

          // Execute tools and build tool results
          const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map(block => {
            if (block.type !== 'tool_use') return { type: 'tool_result' as const, tool_use_id: '', content: '' };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'tool_call', name: block.name })}\n\n`));
            const result = executeTool(block.name, block.input as Record<string, any>, toolCtx);
            return {
              type: 'tool_result' as const,
              tool_use_id: block.id,
              content: result,
            };
          });

          // Add assistant response and tool results to conversation
          currentMessages = [
            ...currentMessages,
            { role: 'assistant' as const, content: response.content },
            { role: 'user' as const, content: toolResults },
          ];

          toolRounds++;
        }
      } catch (error: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: error.message || 'AI request failed' })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
