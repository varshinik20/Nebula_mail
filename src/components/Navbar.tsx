'use client';

import React from 'react';
import { useMailStore } from '@/lib/mailStore';
import { Search, Bot, Radio, Settings, Sparkles, RefreshCw, Command, Bell, User, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  isSSEConnected: boolean;
  onTriggerPush: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, isSSEConnected, onTriggerPush }) => {
  const { filterOptions, setFilterOptions, clearFilters, isAILoading, activeAITool } = useMailStore();

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3 w-64">
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="font-black text-base text-slate-900 tracking-tight">
              Nebula
            </h1>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xs uppercase tracking-wider">
              PRO
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            AI-Driven Mail OS
          </p>
        </div>
      </div>

      {/* Central Search Bar with Command Palette Keyboard Shortcut */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            value={filterOptions.query}
            onChange={(e) => setFilterOptions({ query: e.target.value })}
            placeholder="Search emails, senders, subjects or instruct AI copilot..."
            className="w-full bg-slate-100/80 border border-slate-200/90 rounded-2xl pl-11 pr-16 py-2 text-sm text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-2xs"
          />
          {filterOptions.query ? (
            <button
              onClick={clearFilters}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg px-2 py-0.5 transition-colors"
            >
              Clear
            </button>
          ) : (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-2xs">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Badges & Controls */}
      <div className="flex items-center space-x-3">
        {/* Real-time Push Status Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSSEConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSSEConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-slate-700 font-extrabold text-[11px]">
            {isSSEConnected ? 'Live Sync Active' : 'Connecting Stream'}
          </span>
          <button
            onClick={onTriggerPush}
            title="Simulate incoming real-time push email"
            className="ml-1 text-slate-400 hover:text-indigo-600 transition-colors p-0.5 rounded-md hover:bg-slate-200/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Agent Execution Badge */}
        {isAILoading && (
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs text-indigo-700 font-black animate-pulse shadow-2xs">
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Executing: {activeAITool || 'Tool Call'}...</span>
          </div>
        )}

        {/* User Profile Avatar Pill */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="flex items-center space-x-2 p-1 rounded-2xl bg-slate-100 hover:bg-slate-200/70 cursor-pointer transition-colors border border-slate-200/60">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-black text-xs flex items-center justify-center shadow-xs">
              VK
            </div>
            <span className="text-xs font-extrabold text-slate-800 pr-1.5 hidden lg:inline">
              Varshini K
            </span>
          </div>
        </div>

        {/* Settings Modal Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-all shadow-2xs"
          title="Mail Provider & API Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
