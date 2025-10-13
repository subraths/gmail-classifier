import { GoogleGenAI } from '@google/genai/node';
import { createReadStream, ReadStream } from 'fs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt }: { prompt: string } = await req.json();

  if (!prompt) {
    return new Response('Prompt is required', { status: 400 });
  }

  const ai = new GoogleGenAI({});

  const response = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const encoder = new TextEncoder();
  const reader = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const text = chunk.text;
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(reader);
}
