import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, irish, english } = body;

  if (!irish || !english) {
    return NextResponse.json({ error: 'irish and english are required' }, { status: 400 });
  }

  let prompt = '';

  if (action === 'examples') {
    prompt = `You are an Irish language (Gaeilge) tutor. For the Irish word/phrase "${irish}" which means "${english}", provide:

1. 3 example sentences in Irish with English translations
2. Any important grammar notes (e.g. lenition, eclipsis, genitive case)
3. Common variations or related words

Format your response in clear sections. Keep it concise but educational.`;
  } else if (action === 'explain') {
    prompt = `You are an Irish language (Gaeilge) tutor. Explain the word/phrase "${irish}" (meaning: "${english}") in depth:

1. Etymology or word origin if known
2. Pronunciation guide (phonetic spelling)
3. Which Irish dialect it comes from or if it varies by dialect (Munster, Connacht, Ulster)
4. Memory tips or mnemonics to remember it

Keep your response friendly and helpful for a language learner.`;
  } else if (action === 'quiz_hint') {
    prompt = `You are an Irish language tutor. Give a helpful hint for remembering the Irish word "${irish}" (meaning: "${english}").

Provide ONE short, memorable hint — a mnemonic, a sound-alike, or a visual association. Keep it to 1-2 sentences maximum.`;
  } else {
    return NextResponse.json({ error: 'Invalid action. Use: examples, explain, or quiz_hint' }, { status: 400 });
  }

  const stream = await client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
