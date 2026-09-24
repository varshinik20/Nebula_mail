'use client';

import React from 'react';
import { useMailStore } from '@/lib/mailStore';
import {
  ArrowLeft,
  Reply,
  Forward,
  Star,
  Trash2,
  Paperclip,
  Download,
  Sparkles,
  User,
  Clock,
  Send
} from 'lucide-react';
import { format } from 'date-fns';

export const EmailDetail: React.FC = () => {
  const {
    emails,
    activeEmailId,
    setActiveEmailId,
    toggleStarStatus,
    deleteEmail,
    executeAIAction
  } = useMailStore();

  const activeEmail = emails.find((e) => e.id === activeEmailId);

  if (!activeEmail) return null;

  const threadEmails = emails.filter(
    (e) => e.threadId === activeEmail.threadId && e.id !== activeEmail.id
  );

  const handleQuickReply = () => {
    executeAIAction({
      type: 'reply',
      emailId: activeEmail.id
    });
  };

  const handleForward = () => {
    executeAIAction({
      type: 'forward',
      emailId: activeEmail.id
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 flex flex-col justify-between">
      <div className="space-y-6 max-w-4xl mx-auto w-full">
        {/* Top Header Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveEmailId(null)}
            className="flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inbox</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleQuickReply}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Reply className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
            <button
              onClick={handleForward}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Forward className="w-3.5 h-3.5" />
              <span>Forward</span>
            </button>
            <button
              onClick={() => toggleStarStatus(activeEmail.id)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-amber-400 transition-colors shadow-2xs"
            >
              <Star
                className={`w-4 h-4 ${activeEmail.isStarred ? 'fill-amber-400 text-amber-400' : ''}`}
              />
            </button>
            <button
              onClick={() => deleteEmail(activeEmail.id)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 transition-colors shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subject Header & AI Quick Summary Badge */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {activeEmail.subject}
            </h2>
            {activeEmail.category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 capitalize">
                {activeEmail.category}
              </span>
            )}
          </div>

          {/* AI Quick Insight Pill */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-start space-x-2.5 text-xs text-slate-700">
            <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold text-indigo-900">AI Insight:</span> Email contains key updates regarding project deliverables. Tell assistant <span className="italic font-semibold text-indigo-700">"Reply to this saying I'll review it today"</span> to auto-fill reply.
            </div>
          </div>
        </div>

        {/* Sender Information Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
              {activeEmail.senderName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900">{activeEmail.senderName}</span>
                <span className="text-xs text-slate-500 font-medium">&lt;{activeEmail.senderEmail}&gt;</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">to {activeEmail.recipientEmail}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold" suppressHydrationWarning>
              {format(new Date(activeEmail.timestamp), 'PPpp')}
            </span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-sans shadow-2xs">
          {activeEmail.body}
        </div>

        {/* Attachments Section */}
        {activeEmail.attachments && activeEmail.attachments.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
              <span>Attachments ({activeEmail.attachments.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeEmail.attachments.map((att) => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between group hover:border-indigo-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{att.filename}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{att.size}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thread View Section */}
        {threadEmails.length > 0 && (
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Conversation Thread ({threadEmails.length + 1} messages)
            </h4>
            {threadEmails.map((tMsg) => (
              <div
                key={tMsg.id}
                onClick={() => setActiveEmailId(tMsg.id)}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer space-y-2 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-700">{tMsg.senderName}</span>
                  <span className="text-slate-400 font-medium">{format(new Date(tMsg.timestamp), 'PP')}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{tMsg.preview}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Reply Bar at Bottom */}
      <div className="mt-8 pt-4 border-t border-slate-200 max-w-4xl mx-auto w-full">
        <button
          onClick={handleQuickReply}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-slate-900 flex items-center justify-between text-xs font-semibold transition-all shadow-2xs"
        >
          <div className="flex items-center space-x-2">
            <Reply className="w-4 h-4 text-indigo-600" />
            <span>Click to reply or tell AI Assistant "Reply to this..."</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
            Auto-fill
          </span>
        </button>
      </div>
    </div>
  );
};
