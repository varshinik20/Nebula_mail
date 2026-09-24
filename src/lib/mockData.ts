import { Email } from '../types/mail';

const now = new Date();
const daysAgo = (d: number) => {
  const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
  return date.toISOString();
};

export const INITIAL_EMAILS: Email[] = [
  {
    id: 'email-1',
    threadId: 'thread-sarah-1',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.j@techcorp.io',
    recipientEmail: 'me@nebulaknowlab.com',
    subject: 'Project Update: Q3 AI Integration Roadmap',
    preview: 'Hi team, here is the updated roadmap for our Q3 AI integration deliverables...',
    body: `Hi team,

Here is the updated roadmap for our Q3 AI integration deliverables.

Key milestones:
1. Copilot UI agent integration - Complete
2. Real-time push sync engine - Testing in progress
3. User feedback loop & approval modals - Scheduled for next week

Please review the attached specs and let me know if you have any questions before our sync tomorrow at 10 AM.

Best regards,
Sarah Jenkins
VP of Product Engineering`,
    timestamp: daysAgo(2),
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    category: 'primary',
    labels: ['Work', 'Important'],
    attachments: [
      { id: 'att-1', filename: 'Q3_AI_Roadmap.pdf', size: '2.4 MB', type: 'application/pdf' }
    ]
  },
  {
    id: 'email-2',
    threadId: 'thread-david-1',
    senderName: 'David Miller',
    senderEmail: 'david.m@nebulaknowlab.com',
    recipientEmail: 'me@nebulaknowlab.com',
    subject: 'Architecture Review: Micro-frontend UI State Synchronizer',
    preview: 'Hey! I pushed the prototype for the state synchronizer system to main branch...',
    body: `Hey!

I pushed the prototype for the state synchronizer system to the main repository. 

It handles bidirectional state updates between natural language agent tool calls and client Zustand stores cleanly without triggering infinite re-render loops.

Could you take a look when you get a chance and share your thoughts?

Cheers,
David Miller
Lead Frontend Architect`,
    timestamp: daysAgo(1),
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    category: 'primary',
    labels: ['Code', 'Architecture']
  },
  {
    id: 'email-3',
    threadId: 'thread-john-1',
    senderName: 'John Doe',
    senderEmail: 'john@example.com',
    recipientEmail: 'me@nebulaknowlab.com',
    subject: 'Meeting Tomorrow regarding UI Assistant',
    preview: 'Hi there, confirm our scheduled discussion for tomorrow regarding the UI assistant demo...',
    body: `Hi there,

Just confirming our scheduled discussion for tomorrow regarding the AI assistant UI controller demo.

Let's meet at 3pm on Google Meet. I've sent an invite to your primary email address.

Best,
John Doe`,
    timestamp: daysAgo(5),
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    category: 'primary',
    labels: ['Meeting']
  },
  {
    id: 'email-4',
    threadId: 'thread-alex-1',
    senderName: 'Alex Rivera',
    senderEmail: 'alex.r@designstudio.co',
    recipientEmail: 'me@nebulaknowlab.com',
    subject: 'Dark Mode & Glassmorphism Design Specs',
    preview: 'Check out the high-fidelity dark mode wireframes attached. Neon accents look amazing!',
    body: `Hello!

Check out the high-fidelity dark mode wireframes attached. The glassmorphism card textures and neon accent highlights bring a very sleek, high-end aesthetic to the mail interface.

Let me know if you need any SVG exports or CSS variable definitions.

Warmly,
Alex Rivera`,
    timestamp: daysAgo(8),
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    category: 'primary',
    labels: ['Design'],
    attachments: [
      { id: 'att-2', filename: 'Dark_Mode_UI_Figma.png', size: '4.1 MB', type: 'image/png' }
    ]
  },
  {
    id: 'email-5',
    threadId: 'thread-github-1',
    senderName: 'GitHub Notifications',
    senderEmail: 'notifications@github.com',
    recipientEmail: 'me@nebulaknowlab.com',
    subject: '[Nebula/MailApp] Pull Request #42: Real-time SSE Push Handler merged',
    preview: '@ashwanthnebula merged pull request #42 into main branch...',
    body: `@ashwanthnebula merged 1 commit into main from feature/realtime-sse-sync.

PR Details:
- Implemented Server-Sent Events stream controller
- Added client reconnection backoff strategy
- Added automated unit test suite for push event dispatcher

View pull request on GitHub: https://github.com/Nebula/MailApp/pull/42`,
    timestamp: daysAgo(3),
    folder: 'inbox',
    isRead: false,
    isStarred: false,
    category: 'updates',
    labels: ['DevOps']
  },
  {
    id: 'email-6',
    threadId: 'thread-david-2',
    senderName: 'David Miller',
    senderEmail: 'david.m@nebulaknowlab.com',
    recipientEmail: 'me@nebulaknowlab.com',
    subject: 'Latest Security Patch Recommendations for API Routes',
    preview: 'Here are the recommended security headers and rate limits for our AI endpoints...',
    body: `Hi,

Following our security audit yesterday, here are the recommended rate-limiting parameters and JWT token rotation rules for the public /api/chat and /api/mail/send endpoints.

Let me know when you plan to roll these out to the staging environment.

Thanks,
David Miller`,
    timestamp: daysAgo(0), // Today
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    category: 'primary',
    labels: ['Security', 'Urgent']
  },
  {
    id: 'email-7',
    threadId: 'thread-sent-1',
    senderName: 'Me',
    senderEmail: 'me@nebulaknowlab.com',
    recipientEmail: 'sarah.j@techcorp.io',
    subject: 'Re: Project Update: Q3 AI Integration Roadmap',
    preview: 'Thanks Sarah, the roadmap looks solid. We will review the specs in our sync...',
    body: `Hi Sarah,

Thanks for sharing! The roadmap looks solid. Our team will review the specs in detail ahead of our sync tomorrow.

Best,
Nebula Engineering`,
    timestamp: daysAgo(1),
    folder: 'sent',
    isRead: true,
    isStarred: false,
    category: 'primary'
  }
];
