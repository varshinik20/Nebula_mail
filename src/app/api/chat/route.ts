import { NextRequest, NextResponse } from 'next/server';
import { processAIPrompt, AIContextInfo } from '@/lib/aiAgent';
import { Email } from '@/types/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, context, emails, customApiKey } = body as {
      prompt: string;
      context: AIContextInfo;
      emails: Email[];
      customApiKey?: string;
    };

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Process prompt through AI Agent Processor
    const result = await processAIPrompt(prompt, context, emails || [], customApiKey);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Chat route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
