export type Folder = 'inbox' | 'sent' | 'drafts' | 'starred' | 'archive' | 'trash';

export type Category = 'all' | 'primary' | 'social' | 'updates' | 'promotions';

export type DateRangeFilter = 'all' | 'today' | '7days' | '10days' | '30days' | 'this_week';

export type ReadStatusFilter = 'all' | 'read' | 'unread';

export interface Attachment {
  id: string;
  filename: string;
  size: string;
  type: string;
  url?: string;
}

export interface Email {
  id: string;
  threadId: string;
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  folder: Folder;
  isRead: boolean;
  isStarred: boolean;
  category: Category;
  labels?: string[];
  attachments?: Attachment[];
}

export interface FilterOptions {
  query: string;
  sender: string;
  dateRange: DateRangeFilter;
  readStatus: ReadStatusFilter;
  category: Category;
}

export interface ComposeState {
  isOpen: boolean;
  to: string;
  subject: string;
  body: string;
  inReplyToId?: string;
  inForwardToId?: string;
  isAutoFilling: boolean;
  requiresConfirmation?: boolean;
}

export interface AIActionPayload {
  type: 'compose' | 'filter' | 'navigate' | 'reply' | 'forward' | 'send_confirmation' | 'clear_filters';
  to?: string;
  subject?: string;
  body?: string;
  emailId?: string;
  query?: string;
  sender?: string;
  dateRange?: DateRangeFilter;
  readStatus?: ReadStatusFilter;
  category?: Category;
  emailPreview?: Email;
  emailListPreview?: Email[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  actionPayload?: AIActionPayload;
  requiresActionConfirmation?: boolean;
}

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure?: boolean;
}
