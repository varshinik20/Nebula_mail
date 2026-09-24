import { AIActionPayload, Email, FilterOptions, Folder } from '../types/mail';

export interface AIContextInfo {
  currentFolder: Folder;
  activeEmail: Email | null;
  activeFilters: FilterOptions;
  emailCount: number;
  unreadCount: number;
}

export interface AIProcessResult {
  textResponse: string;
  actionPayload?: AIActionPayload;
  suggestedPrompts?: string[];
}

export async function processAIPrompt(
  prompt: string,
  context: AIContextInfo,
  emails: Email[],
  customApiKey?: string
): Promise<AIProcessResult> {
  const p = prompt.trim().toLowerCase();

  // 1. Compose & Send Intent
  if (
    p.includes('send an email') ||
    p.includes('send email') ||
    p.includes('write an email') ||
    p.includes('compose an email') ||
    p.includes('compose email to') ||
    p.startsWith('send to ') ||
    p.startsWith('email ')
  ) {
    const toMatch = prompt.match(/to\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9_-]+)/i);
    const subjectMatch = prompt.match(/subject\s+['"]([^'"]+)['"]/i) || prompt.match(/subject:\s*([^,.\n]+)/i);
    
    // Extract body after "body" keyword supporting nested apostrophes
    let body = "Hi! Here is the update we discussed.";
    const bodyIndex = prompt.toLowerCase().indexOf('body');
    if (bodyIndex !== -1) {
      const rawBodyPart = prompt.substring(bodyIndex + 4).trim();
      // Remove leading colon or quotes if present
      const cleaned = rawBodyPart.replace(/^[:\s'"]+/, '').replace(/['"]+$/, '');
      if (cleaned) body = cleaned;
    } else {
      const sayingMatch = prompt.match(/saying\s+['"]?([^'"]+)['"]?/i);
      if (sayingMatch) body = sayingMatch[1];
    }

    let recipient = toMatch ? toMatch[1].trim() : '';
    if (recipient.toLowerCase() === 'john') recipient = 'john@example.com';
    if (recipient.toLowerCase() === 'sarah') recipient = 'sarah.j@techcorp.io';
    if (recipient.toLowerCase() === 'david') recipient = 'david.m@nebulaknowlab.com';
    if (!recipient && prompt.includes('john@example.com')) recipient = 'john@example.com';

    const subject = subjectMatch ? subjectMatch[1].trim() : 'Meeting Follow-up';

    return {
      textResponse: `Opening the compose form and filling in recipient (${recipient || 'recipient'}), subject, and body for your review...`,
      actionPayload: {
        type: 'compose',
        to: recipient,
        subject: subject,
        body: body
      },
      suggestedPrompts: ['Confirm and send email', 'Edit subject line', 'Clear form']
    };
  }

  // 2. Context-Aware Reply Intent
  if (p.includes('reply to this') || p.includes('reply saying') || p.startsWith('reply ')) {
    if (!context.activeEmail) {
      return {
        textResponse: "I noticed no email is currently open. Please click on an email first or tell me which email you'd like to reply to!",
        suggestedPrompts: ['Open latest email from David', 'Show emails from Sarah']
      };
    }

    const sayingMatch = prompt.match(/saying\s+['"]?([^'"]+)['"]?/i) || prompt.match(/reply\s+['"]?([^'"]+)['"]?/i);
    const replyBodyText = sayingMatch ? sayingMatch[1] : "Thanks for the update! I will review and get back to you shortly.";

    return {
      textResponse: `Pre-filling reply to ${context.activeEmail.senderName} (${context.activeEmail.senderEmail}) for email "${context.activeEmail.subject}"...`,
      actionPayload: {
        type: 'reply',
        emailId: context.activeEmail.id,
        to: context.activeEmail.senderEmail,
        subject: context.activeEmail.subject.startsWith('Re:') ? context.activeEmail.subject : `Re: ${context.activeEmail.subject}`,
        body: `Hi ${context.activeEmail.senderName.split(' ')[0]},\n\n${replyBodyText}\n\nBest,`
      }
    };
  }

  // 3. Forward Intent
  if (p.includes('forward this') || p.includes('forward to')) {
    const toMatch = prompt.match(/to\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9_-]+)/i);
    const recipient = toMatch ? toMatch[1].trim() : '';

    return {
      textResponse: `Opening forward draft for currently open email...`,
      actionPayload: {
        type: 'forward',
        to: recipient,
        emailId: context.activeEmail?.id
      }
    };
  }

  // 4. Navigate & Open Specific Email Intent (Evaluated BEFORE general search/filter)
  if (p.includes('open ') || p.includes('show the email') || p.includes('view email') || p.startsWith('open')) {
    let sender = '';
    if (p.includes('david')) sender = 'David';
    if (p.includes('sarah')) sender = 'Sarah';
    if (p.includes('john')) sender = 'John';
    if (p.includes('github')) sender = 'GitHub';

    const matchEmail = emails.find((e) => {
      if (sender) return e.senderName.toLowerCase().includes(sender.toLowerCase());
      return true;
    });

    if (matchEmail) {
      return {
        textResponse: `Navigating to and opening email "${matchEmail.subject}" from ${matchEmail.senderName}...`,
        actionPayload: {
          type: 'navigate',
          emailId: matchEmail.id,
          emailPreview: matchEmail
        },
        suggestedPrompts: ['Reply to this', 'Forward to alex@designstudio.co', 'Mark as unread']
      };
    }

    return {
      textResponse: `Couldn't locate a specific email matching your request in the inbox.`,
      suggestedPrompts: ['Show all emails', 'Send email to David']
    };
  }

  // 5. Search & Filter Intent
  if (
    p.includes('show') ||
    p.includes('find') ||
    p.includes('filter') ||
    p.includes('search') ||
    p.includes('list') ||
    p.includes('unread') ||
    p.includes('from ')
  ) {
    let sender = '';
    if (p.includes('from sarah') || p.includes('from sarah jenkins')) sender = 'Sarah';
    if (p.includes('from david') || p.includes('from david miller')) sender = 'David';
    if (p.includes('from john')) sender = 'John';
    if (p.includes('from github')) sender = 'GitHub';

    let dateRange: FilterOptions['dateRange'] = 'all';
    if (p.includes('10 days') || p.includes('last 10 days')) dateRange = '10days';
    else if (p.includes('7 days') || p.includes('last 7 days')) dateRange = '7days';
    else if (p.includes('today')) dateRange = 'today';
    else if (p.includes('this week') || p.includes('from this week')) dateRange = 'this_week';
    else if (p.includes('30 days')) dateRange = '30days';

    let readStatus: FilterOptions['readStatus'] = 'all';
    if (p.includes('unread') || p.includes('only unread')) readStatus = 'unread';
    if (p.includes('read') && !p.includes('unread')) readStatus = 'read';

    let keyword = '';
    if (p.includes('project update') || p.includes('project')) keyword = 'project';
    if (p.includes('architecture')) keyword = 'architecture';
    if (p.includes('meeting')) keyword = 'meeting';

    const filteredPreview = emails.filter((e) => {
      if (sender && !e.senderName.toLowerCase().includes(sender.toLowerCase()) && !e.senderEmail.toLowerCase().includes(sender.toLowerCase())) {
        return false;
      }
      if (readStatus === 'unread' && e.isRead) return false;
      if (keyword && !e.subject.toLowerCase().includes(keyword) && !e.preview.toLowerCase().includes(keyword)) {
        return false;
      }
      return true;
    });

    const descParts: string[] = [];
    if (sender) descParts.push(`from ${sender}`);
    if (readStatus === 'unread') descParts.push(`unread emails`);
    if (dateRange !== 'all') descParts.push(`from ${dateRange.replace('_', ' ')}`);
    if (keyword) descParts.push(`matching "${keyword}"`);

    const filterDesc = descParts.length > 0 ? descParts.join(' ') : 'your query';

    return {
      textResponse: `Updating the main inbox view to display ${filterDesc}. Found ${filteredPreview.length} matching message(s).`,
      actionPayload: {
        type: 'filter',
        sender,
        query: keyword,
        dateRange,
        readStatus,
        emailListPreview: filteredPreview
      },
      suggestedPrompts: ['Clear filters', 'Open top result', 'Reply to latest']
    };
  }

  // 6. Clear filters intent
  if (p.includes('clear filter') || p.includes('reset view') || p.includes('show all')) {
    return {
      textResponse: 'Resetting inbox filters to show all messages.',
      actionPayload: {
        type: 'clear_filters'
      }
    };
  }

  // Default Fallback
  return {
    textResponse: `I'm ready to assist! You can ask me to compose emails, filter the inbox, open specific messages, or reply to what's on your screen.`,
    suggestedPrompts: [
      "Send email to john@example.com with subject 'Meeting Tomorrow' and body 'Let's meet at 3pm'",
      'Show me emails from the last 10 days',
      'Show only unread emails from this week',
      'Open the latest email from David'
    ]
  };
}
