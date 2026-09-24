import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, apiKey, smtpConfig } = await req.json();

    if (!to || !body) {
      return NextResponse.json({ error: 'Recipient and body are required.' }, { status: 400 });
    }

    const resendKey = apiKey || process.env.RESEND_API_KEY;
    const smtpHost = smtpConfig?.host || process.env.SMTP_HOST;
    const smtpUser = smtpConfig?.user || process.env.SMTP_USER;
    const smtpPass = smtpConfig?.pass || process.env.SMTP_PASS;
    const smtpPort = Number(smtpConfig?.port || process.env.SMTP_PORT || 587);

    // 1. Resend API Mode
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Nebula Mail <onboarding@resend.dev>',
          to: [to],
          subject: subject || 'No Subject',
          text: body
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || 'Resend real email transmission failed.' },
          { status: res.status }
        );
      }

      return NextResponse.json({
        success: true,
        provider: 'resend',
        message: `Real email successfully delivered to ${to} via Resend API.`,
        data
      });
    }

    // 2. SMTP Transport Mode (Gmail / Custom SMTP)
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: `"Nebula Mail" <${smtpUser}>`,
        to: to,
        subject: subject || 'No Subject',
        text: body
      });

      return NextResponse.json({
        success: true,
        provider: 'smtp',
        message: `Real email successfully delivered to ${to} via SMTP (${smtpHost}).`,
        messageId: info.messageId
      });
    }

    // 3. Fallback Simulated Mode if no keys provided
    return NextResponse.json({
      success: true,
      provider: 'simulated',
      message: `Email stored in Sent folder for ${to}. (To send real external emails to actual inboxes, configure your Resend API key or Gmail SMTP in Settings ⚙️).`
    });
  } catch (error: any) {
    console.error('Mail send error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send mail via provider' },
      { status: 500 }
    );
  }
}
