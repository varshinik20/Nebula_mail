'use client';

import React, { useState } from 'react';
import { useMailStore } from '@/lib/mailStore';
import { X, Key, Mail, RefreshCw, Check, Sparkles, Server } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    customApiKey,
    mailProvider,
    resendApiKey,
    smtpConfig,
    setSettings,
    resetToDefault,
    addNotification
  } = useMailStore();

  const [apiKey, setApiKey] = useState(customApiKey);
  const [provider, setProvider] = useState<'demo' | 'resend' | 'smtp'>(mailProvider);
  const [resendKey, setResendKey] = useState(resendApiKey);

  const [smtpHost, setSmtpHost] = useState(smtpConfig?.host || 'smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(smtpConfig?.port || 465);
  const [smtpUser, setSmtpUser] = useState(smtpConfig?.user || '');
  const [smtpPass, setSmtpPass] = useState(smtpConfig?.pass || '');

  if (!isOpen) return null;

  const handleSave = () => {
    setSettings({
      customApiKey: apiKey,
      mailProvider: provider,
      resendApiKey: resendKey,
      smtpConfig: {
        host: smtpHost,
        port: Number(smtpPort),
        user: smtpUser,
        pass: smtpPass
      }
    });

    addNotification(
      'Settings Saved',
      `Mail transmission mode set to: ${provider.toUpperCase()}`,
      'success'
    );
    onClose();
  };

  const handleResetData = () => {
    resetToDefault();
    addNotification('Data Reset', 'Restored initial seed emails and filters.', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <Key className="w-4 h-4 text-white" />
            <h3 className="font-black text-sm text-white">Mail Transmission & API Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs overflow-y-auto">
          {/* AI Model Key */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-700 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Gemini / OpenAI Key (Optional)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AI_API_KEY (Leave blank for built-in tool parser)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Provider Selector */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-700 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-600" />
              <span>Real Mail Delivery Provider</span>
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-extrabold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="demo">Interactive Demo Mode (Auto-Reply Simulation)</option>
              <option value="resend">Resend API Provider (Real External Emails)</option>
              <option value="smtp">Custom SMTP / Gmail App Password (Real Delivery)</option>
            </select>
          </div>

          {/* Resend Fields */}
          {provider === 'resend' && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
              <label className="font-black text-indigo-900">Resend API Key</label>
              <input
                type="password"
                value={resendKey}
                onChange={(e) => setResendKey(e.target.value)}
                placeholder="re_123456789..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
              <p className="text-[10px] text-slate-500 font-semibold">
                Get a free API key at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">resend.com</a> to deliver emails to real external inboxes!
              </p>
            </div>
          )}

          {/* SMTP / Gmail Fields */}
          {provider === 'smtp' && (
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-black text-indigo-900">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>SMTP Server Settings (Gmail / Outlook / Custom)</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    placeholder="465"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold">Email Address (Username)</label>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold">App Password / Password</label>
                <input
                  type="password"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  placeholder="16-character Gmail App Password"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                For Gmail: use <strong>smtp.gmail.com</strong>, Port <strong>465</strong>, and create a 16-character App Password in Google Account &gt; Security.
              </p>
            </div>
          )}

          {/* Reset Seed Data */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={handleResetData}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Email Data & Filters</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-1.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-black">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center space-x-1 shadow-2xs"
          >
            <Check className="w-4 h-4" />
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
