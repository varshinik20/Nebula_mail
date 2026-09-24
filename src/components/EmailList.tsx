'use client';

import React from 'react';
import { useMailStore } from '@/lib/mailStore';
import { Email } from '@/types/mail';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Paperclip,
  Mail,
  MailOpen,
  Trash2,
  Inbox
} from 'lucide-react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';

export const EmailList: React.FC = () => {
  const {
    emails,
    currentFolder,
    activeEmailId,
    setActiveEmailId,
    filterOptions,
    toggleReadStatus,
    toggleStarStatus,
    deleteEmail
  } = useMailStore();

  const getDaysDifference = (isoString: string) => {
    const emailDate = new Date(isoString).getTime();
    const now = new Date().getTime();
    return Math.floor((now - emailDate) / (1000 * 60 * 60 * 24));
  };

  const filteredEmails = emails.filter((email) => {
    if (currentFolder === 'starred') {
      if (!email.isStarred) return false;
    } else if (email.folder !== currentFolder) {
      return false;
    }

    if (filterOptions.query) {
      const q = filterOptions.query.toLowerCase();
      const matchSubject = email.subject.toLowerCase().includes(q);
      const matchPreview = email.preview.toLowerCase().includes(q);
      const matchSender = email.senderName.toLowerCase().includes(q) || email.senderEmail.toLowerCase().includes(q);
      if (!matchSubject && !matchPreview && !matchSender) return false;
    }

    if (filterOptions.sender) {
      const s = filterOptions.sender.toLowerCase();
      const matchSender = email.senderName.toLowerCase().includes(s) || email.senderEmail.toLowerCase().includes(s);
      if (!matchSender) return false;
    }

    if (filterOptions.dateRange !== 'all') {
      const daysAgo = getDaysDifference(email.timestamp);
      if (filterOptions.dateRange === 'today' && daysAgo > 0) return false;
      if (filterOptions.dateRange === '7days' && daysAgo > 7) return false;
      if (filterOptions.dateRange === '10days' && daysAgo > 10) return false;
      if (filterOptions.dateRange === 'this_week' && daysAgo > 7) return false;
      if (filterOptions.dateRange === '30days' && daysAgo > 30) return false;
    }

    if (filterOptions.readStatus === 'unread' && email.isRead) return false;
    if (filterOptions.readStatus === 'read' && !email.isRead) return false;

    if (filterOptions.category !== 'all' && email.category !== filterOptions.category) {
      return false;
    }

    return true;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      const days = getDaysDifference(isoString);
      if (days === 0) return format(date, 'h:mm a');
      if (days === 1) return 'Yesterday';
      if (days < 7) return formatDistanceToNow(date, { addSuffix: true });
      return format(date, 'MMM d');
    } catch (e) {
      return isoString;
    }
  };

  const getAvatarGradient = (senderName: string) => {
    const s = senderName.toLowerCase();
    if (s.includes('sarah')) return 'from-rose-500 to-pink-600';
    if (s.includes('david')) return 'from-indigo-600 via-purple-600 to-pink-600';
    if (s.includes('john')) return 'from-amber-500 to-orange-600';
    if (s.includes('alex')) return 'from-emerald-500 to-teal-600';
    if (s.includes('github')) return 'from-slate-800 to-slate-900';
    return 'from-blue-600 to-indigo-600';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100/60">
      <div className="divide-y divide-slate-200/80 bg-white">
        {filteredEmails.length === 0 ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-400 shadow-2xs">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-slate-900">No emails match the filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm font-semibold">
              Try adjusting search terms, date range, or ask the AI Assistant to clear active filters.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredEmails.map((email) => {
              const isSelected = activeEmailId === email.id;

              return (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setActiveEmailId(email.id)}
                  className={`group relative flex items-center justify-between px-6 py-4 cursor-pointer transition-all border-l-4 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-l-indigo-600 shadow-2xs'
                      : !email.isRead
                      ? 'bg-indigo-50/25 border-l-indigo-600 hover:bg-slate-50/90'
                      : 'bg-white border-l-transparent hover:bg-slate-50/80'
                  }`}
                >
                  {/* Left Section: Avatar, Sender, Subject & Preview */}
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-4">
                    {/* Star Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarStatus(email.id);
                      }}
                      className="p-1 rounded-md text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          email.isStarred ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>

                    {/* Sender Avatar */}
                    <div
                      className={`w-8.5 h-8.5 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(
                        email.senderName
                      )} text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs`}
                    >
                      {email.senderName.charAt(0)}
                    </div>

                    {/* Sender Name */}
                    <div className="w-36 flex-shrink-0 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          !email.isRead ? 'font-black text-slate-900' : 'font-extrabold text-slate-700'
                        }`}
                      >
                        {currentFolder === 'sent' ? `To: ${email.recipientEmail}` : email.senderName}
                      </p>
                    </div>

                    {/* Subject & Preview */}
                    <div className="flex-1 min-w-0 flex items-center space-x-2">
                      <span
                        className={`text-sm truncate ${
                          !email.isRead ? 'font-black text-slate-900' : 'text-slate-800 font-bold'
                        }`}
                      >
                        {email.subject}
                      </span>
                      <span className="text-sm text-slate-400 truncate font-semibold hidden md:inline">
                        - {email.preview}
                      </span>
                    </div>
                  </div>

                  {/* Right Section: Labels, Date & Hover Quick Actions */}
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {/* Labels */}
                    {email.labels && email.labels.length > 0 && (
                      <div className="hidden lg:flex items-center space-x-1.5">
                        {email.labels.slice(0, 2).map((lbl) => (
                          <span
                            key={lbl}
                            className="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200/90"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Attachment Icon */}
                    {email.attachments && email.attachments.length > 0 && (
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    )}

                    {/* Date */}
                    <span className="text-xs text-slate-400 font-bold group-hover:hidden" suppressHydrationWarning>
                      {formatDate(email.timestamp)}
                    </span>

                    {/* Hover Quick Action Buttons */}
                    <div className="hidden group-hover:flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReadStatus(email.id);
                        }}
                        title={email.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-2xs"
                      >
                        {email.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEmail(email.id);
                        }}
                        title="Delete Email"
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-600 transition-colors shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
