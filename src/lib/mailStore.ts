import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Email,
  Folder,
  FilterOptions,
  ComposeState,
  ChatMessage,
  AIActionPayload,
  DateRangeFilter,
  SMTPConfig
} from '../types/mail';
import { INITIAL_EMAILS } from './mockData';

export interface MailStore {
  // State
  emails: Email[];
  currentFolder: Folder;
  activeEmailId: string | null;
  filterOptions: FilterOptions;
  composeState: ComposeState;
  chatMessages: ChatMessage[];
  isAILoading: boolean;
  activeAITool: string | null;
  notifications: { id: string; title: string; message: string; type: 'info' | 'success' | 'warning' }[];
  
  // Real Provider Settings
  customApiKey: string;
  mailProvider: 'demo' | 'resend' | 'smtp';
  resendApiKey: string;
  smtpConfig: SMTPConfig;
  
  // Actions - Navigation & View
  setFolder: (folder: Folder) => void;
  setActiveEmailId: (id: string | null) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  
  // Actions - Email Mutations
  toggleReadStatus: (id: string) => void;
  toggleStarStatus: (id: string) => void;
  deleteEmail: (id: string) => void;
  addIncomingEmail: (email: Partial<Email>) => Email;
  
  // Actions - Compose & Form Filling
  openCompose: (params?: { to?: string; subject?: string; body?: string; inReplyToId?: string; inForwardToId?: string; requiresConfirmation?: boolean }) => void;
  closeCompose: () => void;
  updateComposeFields: (fields: Partial<ComposeState>) => void;
  animateAutoFillCompose: (params: { to?: string; subject?: string; body?: string; requiresConfirmation?: boolean }) => Promise<void>;
  sendEmail: (params: { to: string; subject: string; body: string }) => Promise<Email>;
  
  // Actions - AI Agent & Chat
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsAILoading: (loading: boolean, toolName?: string | null) => void;
  executeAIAction: (action: AIActionPayload) => Promise<{ success: boolean; message: string }>;
  
  // Actions - System Notifications
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
  removeNotification: (id: string) => void;
  setSettings: (settings: { customApiKey?: string; mailProvider?: 'demo' | 'resend' | 'smtp'; resendApiKey?: string; smtpConfig?: Partial<SMTPConfig> }) => void;
  resetToDefault: () => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  query: '',
  sender: '',
  dateRange: 'all',
  readStatus: 'all',
  category: 'all'
};

const DEFAULT_COMPOSE: ComposeState = {
  isOpen: false,
  to: '',
  subject: '',
  body: '',
  isAutoFilling: false,
  requiresConfirmation: false
};

const DEFAULT_SMTP: SMTPConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  user: '',
  pass: '',
  secure: true
};

export const useMailStore = create<MailStore>()(
  persist(
    (set, get) => ({
      emails: INITIAL_EMAILS,
      currentFolder: 'inbox',
      activeEmailId: null,
      filterOptions: DEFAULT_FILTERS,
      composeState: DEFAULT_COMPOSE,
      chatMessages: [
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: `👋 **Welcome to Nebula Mail!** I'm your AI assistant capable of controlling the UI directly.

Try telling me:
• *"Send an email to john@example.com with subject 'Meeting Tomorrow' and body 'Let's meet at 3pm'"*
• *"Show me emails from Sarah"*
• *"Show unread emails from this week"*
• *"Open the latest email from David"*
• *"Reply to this email"* (when reading an email)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      isAILoading: false,
      activeAITool: null,
      notifications: [],
      customApiKey: '',
      mailProvider: 'demo',
      resendApiKey: '',
      smtpConfig: DEFAULT_SMTP,

      setFolder: (folder) => {
        set({ currentFolder: folder, activeEmailId: null });
      },

      setActiveEmailId: (id) => {
        set({ activeEmailId: id });
        if (id) {
          set((state) => ({
            emails: state.emails.map((e) => (e.id === id ? { ...e, isRead: true } : e))
          }));
        }
      },

      setFilterOptions: (options) => {
        set((state) => ({
          filterOptions: { ...state.filterOptions, ...options },
          activeEmailId: null
        }));
      },

      clearFilters: () => {
        set({ filterOptions: DEFAULT_FILTERS });
      },

      toggleReadStatus: (id) => {
        set((state) => ({
          emails: state.emails.map((e) => (e.id === id ? { ...e, isRead: !e.isRead } : e))
        }));
      },

      toggleStarStatus: (id) => {
        set((state) => ({
          emails: state.emails.map((e) => (e.id === id ? { ...e, isStarred: !e.isStarred } : e))
        }));
      },

      deleteEmail: (id) => {
        set((state) => ({
          emails: state.emails.map((e) => (e.id === id ? { ...e, folder: 'trash' as Folder } : e)),
          activeEmailId: state.activeEmailId === id ? null : state.activeEmailId
        }));
        get().addNotification('Email Moved', 'Email moved to Trash.', 'info');
      },

      addIncomingEmail: (emailData) => {
        const newEmail: Email = {
          id: `email-push-${Date.now()}`,
          threadId: emailData.threadId || `thread-push-${Date.now()}`,
          senderName: emailData.senderName || 'Incoming Sender',
          senderEmail: emailData.senderEmail || 'notification@nebula.io',
          recipientEmail: 'me@nebulaknowlab.com',
          subject: emailData.subject || 'New Live Email Sync',
          preview: emailData.preview || (emailData.body ? emailData.body.slice(0, 80) : 'New push message received'),
          body: emailData.body || 'This email was delivered via real-time push sync engine.',
          timestamp: new Date().toISOString(),
          folder: 'inbox',
          isRead: false,
          isStarred: false,
          category: emailData.category || 'primary',
          labels: emailData.labels || ['Live Sync']
        };

        set((state) => ({
          emails: [newEmail, ...state.emails]
        }));

        get().addNotification('New Email Received', `From: ${newEmail.senderName} - "${newEmail.subject}"`, 'success');
        return newEmail;
      },

      openCompose: (params) => {
        set({
          composeState: {
            isOpen: true,
            to: params?.to || '',
            subject: params?.subject || '',
            body: params?.body || '',
            inReplyToId: params?.inReplyToId,
            inForwardToId: params?.inForwardToId,
            isAutoFilling: false,
            requiresConfirmation: params?.requiresConfirmation || false
          }
        });
      },

      closeCompose: () => {
        set({ composeState: DEFAULT_COMPOSE });
      },

      updateComposeFields: (fields) => {
        set((state) => ({
          composeState: { ...state.composeState, ...fields }
        }));
      },

      animateAutoFillCompose: async ({ to = '', subject = '', body = '', requiresConfirmation = false }) => {
        set({
          composeState: {
            isOpen: true,
            to: '',
            subject: '',
            body: '',
            isAutoFilling: true,
            requiresConfirmation
          }
        });

        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        let currentTo = '';
        for (let i = 0; i < to.length; i++) {
          currentTo += to[i];
          set((state) => ({ composeState: { ...state.composeState, to: currentTo } }));
          await delay(25);
        }
        await delay(150);

        let currentSubject = '';
        for (let i = 0; i < subject.length; i++) {
          currentSubject += subject[i];
          set((state) => ({ composeState: { ...state.composeState, subject: currentSubject } }));
          await delay(20);
        }
        await delay(150);

        let currentBody = '';
        const bodyWords = body.split(' ');
        for (let i = 0; i < bodyWords.length; i++) {
          currentBody += (i === 0 ? '' : ' ') + bodyWords[i];
          set((state) => ({ composeState: { ...state.composeState, body: currentBody } }));
          await delay(40);
        }

        set((state) => ({
          composeState: { ...state.composeState, isAutoFilling: false }
        }));
      },

      sendEmail: async ({ to, subject, body }) => {
        const state = get();
        let apiResult = null;

        // Call backend API endpoint to transmit email via Resend / SMTP / NodeMailer
        try {
          const res = await fetch('/api/mail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to,
              subject,
              body,
              apiKey: state.mailProvider === 'resend' ? state.resendApiKey : undefined,
              smtpConfig: state.mailProvider === 'smtp' ? state.smtpConfig : undefined
            })
          });

          apiResult = await res.json();
          if (!res.ok || apiResult.error) {
            get().addNotification(
              'Real Mail Warning',
              apiResult?.error || 'Provider rejected transmission. Added email to Sent folder in app.',
              'warning'
            );
          }
        } catch (e: any) {
          console.warn('Mail send API error:', e);
        }

        const sentEmail: Email = {
          id: `sent-${Date.now()}`,
          threadId: `thread-sent-${Date.now()}`,
          senderName: 'Me',
          senderEmail: state.smtpConfig?.user || 'me@nebulaknowlab.com',
          recipientEmail: to,
          subject: subject || '(No Subject)',
          preview: body.slice(0, 100),
          body: body,
          timestamp: new Date().toISOString(),
          folder: 'sent',
          isRead: true,
          isStarred: false,
          category: 'primary'
        };

        set((s) => ({
          emails: [sentEmail, ...s.emails],
          composeState: DEFAULT_COMPOSE,
          activeEmailId: null,
          currentFolder: 'inbox'
        }));

        if (apiResult?.provider === 'resend' || apiResult?.provider === 'smtp') {
          get().addNotification('Real Email Transmitted! 🚀', `Successfully delivered to real external inbox (${to}) via ${apiResult.provider.toUpperCase()}.`, 'success');
        } else {
          get().addNotification(
            'Email Transmitted & Saved! 📬',
            `Message sent to ${to} and saved in Sent folder. Configure Resend API Key or Gmail SMTP in Settings ⚙️ for external inbox delivery.`,
            'success'
          );
        }

        return sentEmail;
      },

      addChatMessage: (msg) => {
        const newMsg: ChatMessage = {
          ...msg,
          id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, newMsg]
        }));
      },

      setIsAILoading: (loading, toolName = null) => {
        set({ isAILoading: loading, activeAITool: toolName });
      },

      executeAIAction: async (action: AIActionPayload) => {
        const state = get();
        
        switch (action.type) {
          case 'compose': {
            if (action.to || action.subject || action.body) {
              await state.animateAutoFillCompose({
                to: action.to,
                subject: action.subject,
                body: action.body,
                requiresConfirmation: true
              });
              return { success: true, message: `Opened compose view and visibly populated fields for ${action.to || 'recipient'}.` };
            }
            state.openCompose();
            return { success: true, message: 'Opened email compose view.' };
          }

          case 'filter': {
            const dateRange: DateRangeFilter = action.dateRange || 'all';
            state.setFilterOptions({
              query: action.query || '',
              sender: action.sender || '',
              dateRange: dateRange,
              readStatus: action.readStatus || 'all',
              category: action.category || 'all'
            });
            state.setFolder('inbox');
            return { success: true, message: 'Updated email filters and refreshed inbox view.' };
          }

          case 'navigate': {
            let targetEmail: Email | undefined;
            if (action.emailId) {
              targetEmail = state.emails.find((e) => e.id === action.emailId);
            } else if (action.sender) {
              const senderLower = action.sender.toLowerCase();
              targetEmail = state.emails.find(
                (e) => e.senderName.toLowerCase().includes(senderLower) || e.senderEmail.toLowerCase().includes(senderLower)
              );
            } else if (action.query) {
              const q = action.query.toLowerCase();
              targetEmail = state.emails.find(
                (e) => e.subject.toLowerCase().includes(q) || e.preview.toLowerCase().includes(q) || e.senderName.toLowerCase().includes(q)
              );
            }

            if (targetEmail) {
              state.setFolder(targetEmail.folder);
              state.setActiveEmailId(targetEmail.id);
              return { success: true, message: `Navigated to email "${targetEmail.subject}" from ${targetEmail.senderName}.` };
            }
            return { success: false, message: 'Could not find matching email to display.' };
          }

          case 'reply': {
            let targetEmail = state.activeEmailId ? state.emails.find((e) => e.id === state.activeEmailId) : null;
            if (!targetEmail && action.emailId) {
              targetEmail = state.emails.find((e) => e.id === action.emailId);
            }

            if (targetEmail) {
              const replySubject = targetEmail.subject.startsWith('Re:') ? targetEmail.subject : `Re: ${targetEmail.subject}`;
              const defaultBody = action.body || `Hi ${targetEmail.senderName.split(' ')[0]},\n\n`;
              
              await state.animateAutoFillCompose({
                to: targetEmail.senderEmail,
                subject: replySubject,
                body: defaultBody,
                requiresConfirmation: true
              });
              
              return { success: true, message: `Pre-filled reply to ${targetEmail.senderName} (${targetEmail.senderEmail}).` };
            }
            return { success: false, message: 'No active email found to reply to. Please open an email first.' };
          }

          case 'forward': {
            let targetEmail = state.activeEmailId ? state.emails.find((e) => e.id === state.activeEmailId) : null;
            if (!targetEmail && action.emailId) {
              targetEmail = state.emails.find((e) => e.id === action.emailId);
            }

            if (targetEmail) {
              const fwdSubject = targetEmail.subject.startsWith('Fwd:') ? targetEmail.subject : `Fwd: ${targetEmail.subject}`;
              const fwdBody = `\n\n---------- Forwarded message ---------\nFrom: ${targetEmail.senderName} <${targetEmail.senderEmail}>\nSubject: ${targetEmail.subject}\n\n${targetEmail.body}`;
              
              await state.animateAutoFillCompose({
                to: action.to || '',
                subject: fwdSubject,
                body: fwdBody,
                requiresConfirmation: true
              });
              return { success: true, message: `Pre-filled forward draft of "${targetEmail.subject}".` };
            }
            return { success: false, message: 'No active email open to forward.' };
          }

          case 'clear_filters': {
            state.clearFilters();
            return { success: true, message: 'Cleared all search and filter conditions.' };
          }

          default:
            return { success: false, message: 'Unknown action type.' };
        }
      },

      addNotification: (title, message, type = 'info') => {
        const id = `notif-${Date.now()}`;
        set((s) => ({
          notifications: [...s.notifications, { id, title, message, type }]
        }));
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },

      removeNotification: (id) => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id)
        }));
      },

      setSettings: (settings) => {
        set((s) => ({
          ...s,
          ...settings,
          smtpConfig: settings.smtpConfig
            ? { ...s.smtpConfig, ...settings.smtpConfig }
            : s.smtpConfig
        }));
      },

      resetToDefault: () => {
        set({
          emails: INITIAL_EMAILS,
          currentFolder: 'inbox',
          activeEmailId: null,
          filterOptions: DEFAULT_FILTERS,
          composeState: DEFAULT_COMPOSE
        });
      }
    }),
    {
      name: 'nebula-mail-store-v1',
      partialize: (state) => ({
        emails: state.emails,
        customApiKey: state.customApiKey,
        mailProvider: state.mailProvider,
        resendApiKey: state.resendApiKey,
        smtpConfig: state.smtpConfig
      })
    }
  )
);
