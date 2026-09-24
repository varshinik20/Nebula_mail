'use client';

import React, { useState } from 'react';
import { useMailStore } from '@/lib/mailStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export const ComposeModal: React.FC = () => {
  const { composeState, closeCompose, updateComposeFields, sendEmail, addNotification } = useMailStore();
  const [isSending, setIsSending] = useState(false);

  if (!composeState.isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!composeState.to) {
      addNotification('Missing Recipient', 'Please enter a recipient email address.', 'warning');
      return;
    }

    setIsSending(true);
    try {
      await sendEmail({
        to: composeState.to,
        subject: composeState.subject,
        body: composeState.body
      });
      closeCompose();
    } catch (err: any) {
      addNotification('Send Error', err?.message || 'Failed to send email', 'warning');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <span className="font-black text-sm text-white">New Message</span>
              {composeState.isAutoFilling && (
                <span className="flex items-center space-x-1.5 text-xs text-indigo-100 bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 animate-pulse font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Painting Form...</span>
                </span>
              )}
            </div>
            <button
              onClick={closeCompose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Human-In-The-Loop Confirmation Banner */}
          {composeState.requiresConfirmation && !composeState.isAutoFilling && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-amber-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Human-in-the-Loop Confirmation:</strong> The AI Assistant prepared this draft. Review before sending.
                </span>
              </div>
              <button
                onClick={() => handleSend()}
                className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-colors shadow-2xs"
              >
                Approve & Send
              </button>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSend} className="p-6 space-y-4 flex-1 overflow-y-auto">
            {/* Recipient To Field */}
            <div className="flex items-center border-b border-slate-200 pb-2.5">
              <label className="w-20 text-xs font-bold text-slate-500">To:</label>
              <input
                type="text"
                value={composeState.to}
                onChange={(e) => updateComposeFields({ to: e.target.value })}
                placeholder="recipient@example.com"
                className={`flex-1 bg-transparent text-sm text-slate-900 font-extrabold focus:outline-none ${
                  composeState.isAutoFilling ? 'font-mono text-indigo-600 bg-indigo-50/50 rounded px-1' : ''
                }`}
              />
            </div>

            {/* Subject Field */}
            <div className="flex items-center border-b border-slate-200 pb-2.5">
              <label className="w-20 text-xs font-bold text-slate-500">Subject:</label>
              <input
                type="text"
                value={composeState.subject}
                onChange={(e) => updateComposeFields({ subject: e.target.value })}
                placeholder="Subject line..."
                className={`flex-1 bg-transparent text-sm text-slate-900 font-black focus:outline-none ${
                  composeState.isAutoFilling ? 'font-mono text-indigo-600 bg-indigo-50/50 rounded px-1' : ''
                }`}
              />
            </div>

            {/* Body TextArea */}
            <div className="flex-1 min-h-[220px] flex flex-col">
              <textarea
                value={composeState.body}
                onChange={(e) => updateComposeFields({ body: e.target.value })}
                placeholder="Write your email body here or instruct the AI assistant to write it..."
                rows={10}
                className={`w-full h-full bg-slate-50/70 p-4 border border-slate-200 rounded-2xl text-sm text-slate-900 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white resize-none shadow-2xs ${
                  composeState.isAutoFilling ? 'font-mono text-indigo-600 bg-indigo-50/80 border-indigo-300' : ''
                }`}
              />
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={isSending || composeState.isAutoFilling}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm flex items-center space-x-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending...' : 'Send Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => addNotification('Attachment Added', 'Simulated file attached.', 'info')}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Attach File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={closeCompose}
                className="p-2.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Discard Draft"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
