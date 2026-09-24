import { describe, it, expect } from 'vitest';
import { processAIPrompt, AIContextInfo } from '../lib/aiAgent';
import { INITIAL_EMAILS } from '../lib/mockData';

describe('AI Agent Intent Parser Tests', () => {
  const defaultContext: AIContextInfo = {
    currentFolder: 'inbox',
    activeEmail: null,
    activeFilters: {
      query: '',
      sender: '',
      dateRange: 'all',
      readStatus: 'all',
      category: 'all'
    },
    emailCount: INITIAL_EMAILS.length,
    unreadCount: 3
  };

  it('should parse Compose & Send intent correctly', async () => {
    const prompt = "Send an email to john@example.com with subject 'Meeting Tomorrow' and body 'Let's meet at 3pm'";
    const res = await processAIPrompt(prompt, defaultContext, INITIAL_EMAILS);

    expect(res.actionPayload).toBeDefined();
    expect(res.actionPayload?.type).toBe('compose');
    expect(res.actionPayload?.to).toBe('john@example.com');
    expect(res.actionPayload?.subject).toBe('Meeting Tomorrow');
    expect(res.actionPayload?.body).toBe("Let's meet at 3pm");
  });

  it('should parse Search & Filter date range intent', async () => {
    const prompt = 'Show me emails from the last 10 days';
    const res = await processAIPrompt(prompt, defaultContext, INITIAL_EMAILS);

    expect(res.actionPayload?.type).toBe('filter');
    expect(res.actionPayload?.dateRange).toBe('10days');
  });

  it('should parse unread emails from this week filter intent', async () => {
    const prompt = 'Show only unread emails from this week';
    const res = await processAIPrompt(prompt, defaultContext, INITIAL_EMAILS);

    expect(res.actionPayload?.type).toBe('filter');
    expect(res.actionPayload?.readStatus).toBe('unread');
    expect(res.actionPayload?.dateRange).toBe('this_week');
  });

  it('should parse Navigate & Open intent for David', async () => {
    const prompt = 'Open the latest email from David';
    const res = await processAIPrompt(prompt, defaultContext, INITIAL_EMAILS);

    expect(res.actionPayload?.type).toBe('navigate');
    expect(res.actionPayload?.emailPreview?.senderName).toBe('David Miller');
  });

  it('should parse Context-Aware Reply intent when an email is active', async () => {
    const activeEmailContext: AIContextInfo = {
      ...defaultContext,
      activeEmail: INITIAL_EMAILS[0] // Sarah's email
    };

    const prompt = 'Reply to this saying I will review the roadmap';
    const res = await processAIPrompt(prompt, activeEmailContext, INITIAL_EMAILS);

    expect(res.actionPayload?.type).toBe('reply');
    expect(res.actionPayload?.to).toBe(INITIAL_EMAILS[0].senderEmail);
    expect(res.actionPayload?.subject).toContain(INITIAL_EMAILS[0].subject);
  });
});
