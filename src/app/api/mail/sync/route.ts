import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      // Send initial heartbeat
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'Real-time push sync active' })}\n\n`)
      );

      // Periodically push an example incoming email after 30s to demonstrate live sync without page reload
      const interval = setInterval(() => {
        const sampleIncoming = {
          type: 'new_email',
          email: {
            senderName: 'Nebula Sentinel Bot',
            senderEmail: 'sentinel@nebulaknowlab.com',
            subject: `Automated Health Check: All Systems Operational (${new Date().toLocaleTimeString()})`,
            preview: 'Real-time SSE push sync payload delivered automatically to inbox without refresh...',
            body: `Hello! This is a real-time push sync email generated automatically by the Nebula push server at ${new Date().toLocaleString()}.\n\nNo page refresh was required to render this in your inbox view!`,
            category: 'updates',
            labels: ['Automated', 'Push Sync']
          }
        };

        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(sampleIncoming)}\n\n`));
        } catch (e) {
          clearInterval(interval);
        }
      }, 45000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(customStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
}

// POST endpoint allowing instant user-triggered push simulation
export async function POST(req: NextRequest) {
  try {
    const { senderName, subject, body } = await req.json();

    const pushedEmail = {
      senderName: senderName || 'Instant Trigger Sender',
      senderEmail: 'live.push@nebulaknowlab.com',
      subject: subject || `Live Push Email (${new Date().toLocaleTimeString()})`,
      preview: body ? body.slice(0, 80) : 'Instant push notification received from real-time sync controller.',
      body: body || 'This email was pushed instantly into the inbox via the Server-Sent Events push endpoint.',
      category: 'primary',
      labels: ['Push Sync', 'Instant']
    };

    return NextResponse.json({ success: true, email: pushedEmail });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed push sync' }, { status: 500 });
  }
}
