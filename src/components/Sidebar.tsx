'use client';

import React from 'react';
import { useMailStore } from '@/lib/mailStore';
import { Folder } from '@/types/mail';
import {
  Inbox,
  Send,
  FileText,
  Star,
  Trash2,
  Plus,
  Radio,
  Zap,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  onTriggerPush: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onTriggerPush }) => {
  const { currentFolder, setFolder, openCompose, emails } = useMailStore();

  const getUnreadCount = (folder: Folder) => {
    return emails.filter((e) => e.folder === folder && !e.isRead).length;
  };

  const folderItems: { id: Folder; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" />, color: 'text-indigo-600' },
    { id: 'sent', label: 'Sent', icon: <Send className="w-4 h-4" />, color: 'text-cyan-600' },
    { id: 'starred', label: 'Starred', icon: <Star className="w-4 h-4" />, color: 'text-amber-500' },
    { id: 'drafts', label: 'Drafts', icon: <FileText className="w-4 h-4" />, color: 'text-purple-600' },
    { id: 'trash', label: 'Trash', icon: <Trash2 className="w-4 h-4" />, color: 'text-rose-500' }
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-slate-50/80 p-4 flex flex-col overflow-y-auto space-y-4 select-none">
      <div className="space-y-5">
        {/* Workspace Account Selector Card */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              NK
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-xs text-slate-900 truncate flex items-center space-x-1">
                <span>Nebula KnowLab</span>
                <CheckCircle2 className="w-3 h-3 text-indigo-600 inline" />
              </h4>
              <p className="text-[10px] font-bold text-slate-400 truncate">me@nebulaknowlab.com</p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </div>

        {/* Compose Button */}
        <button
          onClick={() => openCompose()}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          <span>New Message</span>
        </button>

        {/* Navigation Folders */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
            Folders
          </p>
          {folderItems.map((item) => {
            const isActive = currentFolder === item.id;
            const unread = getUnreadCount(item.id);

            return (
              <button
                key={item.id}
                onClick={() => setFolder(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-extrabold transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : item.color}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {unread > 0 && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Categories / Quick Tags */}
        <div className="pt-2">
          <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
            Labels & Tags
          </p>
          <div className="space-y-1.5 text-xs font-extrabold">
            <div className="flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-200/40 rounded-xl cursor-pointer transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs"></span>
                <span>Work / Projects</span>
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold">12</span>
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-200/40 rounded-xl cursor-pointer transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-2xs"></span>
                <span>Architecture</span>
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold">5</span>
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-200/40 rounded-xl cursor-pointer transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-2xs"></span>
                <span>Design / UI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold">8</span>
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-200/40 rounded-xl cursor-pointer transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs"></span>
                <span>Urgent</span>
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Push Simulator Box */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-black text-slate-900">
          <span className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Real-time Push</span>
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md font-black">
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
          Incoming emails stream instantly via Server-Sent Events without refresh.
        </p>
        <button
          onClick={onTriggerPush}
          className="w-full py-2 text-xs font-black rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Simulate Push Event</span>
        </button>
      </div>
    </aside>
  );
};
