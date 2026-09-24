'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMailStore } from '@/lib/mailStore';
import { ChatMessage } from '@/types/mail';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  X,
  Zap
} from 'lucide-react';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ isOpen, onToggle }) => {
  const {
    chatMessages,
    addChatMessage,
    isAILoading,
    setIsAILoading,
    executeAIAction,
    emails,
    currentFolder,
    activeEmailId,
    filterOptions,
    customApiKey
  } = useMailStore();

  const [inputPrompt, setInputPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeEmail = emails.find((e) => e.id === activeEmailId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAILoading]);

  const handleSendPrompt = async (promptText?: string) => {
    const textToSubmit = promptText || inputPrompt;
    if (!textToSubmit.trim() || isAILoading) return;

    setInputPrompt('');

    addChatMessage({
      sender: 'user',
      text: textToSubmit
    });

    setIsAILoading(true, 'Analyzing Intent');

    try {
      const context = {
        currentFolder,
        activeEmail: activeEmail || null,
        activeFilters: filterOptions,
        emailCount: emails.length,
        unreadCount: emails.filter((e) => !e.isRead).length
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSubmit,
          context,
          emails,
          customApiKey
        })
      });

      const data = await response.json();

      setIsAILoading(false);

      if (data.error) {
        addChatMessage({
          sender: 'assistant',
          text: `⚠️ Error: ${data.error}`
        });
        return;
      }

      addChatMessage({
        sender: 'assistant',
        text: data.textResponse,
        actionPayload: data.actionPayload,
        requiresActionConfirmation: data.actionPayload?.type === 'send_confirmation'
      });

      if (data.actionPayload) {
        await executeAIAction(data.actionPayload);
      }
    } catch (err: any) {
      setIsAILoading(false);
      addChatMessage({
        sender: 'assistant',
        text: `⚠️ Failed to connect to AI server: ${err?.message || 'Unknown error'}`
      });
    }
  };

  const samplePrompts = [
    "Send an email to john@example.com with subject 'Meeting Tomorrow' and body 'Let's meet at 3pm'",
    "Show me emails from the last 10 days",
    "Show only unread emails from this week",
    "Find the email from Sarah about the project update",
    "Open the latest email from David",
    "Reply to this email"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all duration-200 flex items-center space-x-2.5 font-black text-xs"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        <span>AI Assistant (UI Control)</span>
      </button>
    );
  }

  return (
    <aside className="w-96 border-l border-slate-200 bg-white flex flex-col justify-between select-none shadow-none z-30">
      {/* Drawer Header with Gradient Ring */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-sm">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center space-x-1.5">
              <span>Nebula Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </h3>
            <p className="text-[10px] text-indigo-600 font-extrabold">UI Controller Agent Active</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/40">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-4 rounded-2xl ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-br-none shadow-md shadow-indigo-500/10'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none shadow-2xs font-semibold'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px] opacity-80">
                  <span className="font-black">{isUser ? 'You' : 'Copilot UI'}</span>
                  <span suppressHydrationWarning>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</div>

                {/* Rich UI Rendering inside Assistant Panel */}
                {msg.actionPayload && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                    {/* Action Execution Pill */}
                    <div className="flex items-center space-x-1.5 text-[10px] text-indigo-700 font-black bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="uppercase tracking-wider">
                        UI Executed: {msg.actionPayload.type.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Rich Interactive Email Preview Card inside Chat */}
                    {msg.actionPayload.emailPreview && (
                      <div
                        onClick={() => executeAIAction({ type: 'navigate', emailId: msg.actionPayload?.emailPreview?.id })}
                        className="p-3 rounded-2xl bg-white border border-indigo-200 hover:border-indigo-400 cursor-pointer space-y-1 transition-all shadow-2xs group"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-black text-indigo-600 group-hover:underline">
                            {msg.actionPayload.emailPreview.senderName}
                          </span>
                          <span className="text-slate-400 font-bold">Preview Card</span>
                        </div>
                        <p className="font-black text-slate-900 text-xs truncate">
                          {msg.actionPayload.emailPreview.subject}
                        </p>
                        <p className="text-slate-500 line-clamp-2 text-[10px] font-semibold">
                          {msg.actionPayload.emailPreview.preview}
                        </p>
                      </div>
                    )}

                    {/* Rich Filter Result Summary inside Chat */}
                    {msg.actionPayload.emailListPreview && (
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <p className="text-[10px] text-slate-700 font-bold">
                          Updated inbox list with {msg.actionPayload.emailListPreview.length} matched message(s).
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isAILoading && (
          <div className="flex items-center space-x-2 text-indigo-700 text-xs font-black p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 animate-pulse shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>AI agent is controlling the UI...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1.5 pb-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Suggested Prompts:
          </span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {samplePrompts.slice(0, 4).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(prompt)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-[11px] text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 font-extrabold transition-colors whitespace-nowrap shadow-2xs"
            >
              {prompt.length > 32 ? prompt.slice(0, 32) + '...' : prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Natural Language Input Bar */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Instruct AI: 'Send email...', 'Show emails from Sarah'..."
            className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-4 pr-10 py-3 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-2xs transition-all"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isAILoading}
            className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white disabled:opacity-40 transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
};
