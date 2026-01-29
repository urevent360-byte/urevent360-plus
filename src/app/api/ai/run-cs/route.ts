import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Dynamic import: server-only
  const { continueConversation } = await import('@/ai/flows/customer-support-flow');

  // Expecting optional JSON: { messages: [...] }
  // If none provided, default to empty array.
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];

  const result = await continueConversation(messages);

  return NextResponse.json(result);
}
