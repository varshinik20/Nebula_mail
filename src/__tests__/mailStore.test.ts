import { describe, it, expect, beforeEach } from 'vitest';
import { useMailStore } from '../lib/mailStore';

describe('MailStore Unit Tests', () => {
  beforeEach(() => {
    useMailStore.getState().resetToDefault();
  });

  it('should initialize with default seed emails and inbox folder', () => {
    const state = useMailStore.getState();
    expect(state.emails.length).toBeGreaterThan(0);
    expect(state.currentFolder).toBe('inbox');
  });

  it('should update folder and filter options correctly', () => {
    const store = useMailStore.getState();
    store.setFolder('sent');
    expect(useMailStore.getState().currentFolder).toBe('sent');

    store.setFilterOptions({ sender: 'Sarah', dateRange: '10days' });
    const filters = useMailStore.getState().filterOptions;
    expect(filters.sender).toBe('Sarah');
    expect(filters.dateRange).toBe('10days');
  });

  it('should execute compose AI action and open compose form', async () => {
    const store = useMailStore.getState();
    const result = await store.executeAIAction({
      type: 'compose',
      to: 'john@example.com',
      subject: 'Meeting Tomorrow',
      body: "Let's meet at 3pm"
    });

    expect(result.success).toBe(true);
    const compose = useMailStore.getState().composeState;
    expect(compose.isOpen).toBe(true);
    expect(compose.to).toBe('john@example.com');
    expect(compose.subject).toBe('Meeting Tomorrow');
    expect(compose.body).toBe("Let's meet at 3pm");
  });

  it('should add incoming email via live push sync', () => {
    const store = useMailStore.getState();
    const newEmail = store.addIncomingEmail({
      senderName: 'Test Sender',
      subject: 'Push Notification Test',
      body: 'Hello world'
    });

    expect(newEmail.id).toBeDefined();
    const updatedEmails = useMailStore.getState().emails;
    expect(updatedEmails[0].subject).toBe('Push Notification Test');
  });
});
