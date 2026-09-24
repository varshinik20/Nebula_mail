'use client';

import React, { useState, useEffect } from 'react';
import { useMailStore } from '@/lib/mailStore';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { FilterBar } from '@/components/FilterBar';
import { EmailList } from '@/components/EmailList';
import { EmailDetail } from '@/components/EmailDetail';
import { ComposeModal } from '@/components/ComposeModal';
import { AIAssistantPanel } from '@/components/AIAssistantPanel';
import { SettingsModal } from '@/components/SettingsModal';
import { ToastContainer } from '@/components/ToastContainer';

export default function Home() {
  const { activeEmailId, addIncomingEmail, addNotification } = useMailStore();

  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSSEConnected, setIsSSEConnected] = useState(false);

  // Initialize Server-Sent Events (SSE) for Real-Time Push Sync
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/mail/sync');

      eventSource.onopen = () => {
        setIsSSEConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connected') {
            setIsSSEConnected(true);
          } else if (data.type === 'new_email' && data.email) {
            addIncomingEmail(data.email);
          }
        } catch (e) {
          console.warn('SSE message parse error:', e);
        }
      };

      eventSource.onerror = () => {
        setIsSSEConnected(false);
      };
    } catch (e) {
      console.warn('EventSource initialization fallback:', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [addIncomingEmail]);

  // Handler to trigger simulated incoming push email on demand
  const handleTriggerInstantPush = async () => {
    try {
      const res = await fetch('/api/mail/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: 'Sarah Jenkins',
          subject: `Live Push: Updated AI Integration Spec (${new Date().toLocaleTimeString()})`,
          body: 'Hi team! Here is the latest push payload delivered directly to your inbox stream in real time.'
        })
      });

      const data = await res.json();
      if (data.email) {
        addIncomingEmail(data.email);
      }
    } catch (e) {
      addNotification('Push Error', 'Failed to trigger live push simulation', 'warning');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-slate-900 overflow-hidden font-sans select-none m-0 p-0">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSSEConnected={isSSEConnected}
        onTriggerPush={handleTriggerInstantPush}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar onTriggerPush={handleTriggerInstantPush} />

        {/* Central Mail Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 border-r border-slate-200/80 overflow-hidden">
          <FilterBar />

          {/* Conditional View: Detail View or Email List */}
          {activeEmailId ? <EmailDetail /> : <EmailList />}
        </main>

        {/* Right AI Assistant Drawer Panel */}
        <AIAssistantPanel
          isOpen={isAIPanelOpen}
          onToggle={() => setIsAIPanelOpen(!isAIPanelOpen)}
        />
      </div>

      {/* Floating Modals & Toasts */}
      <ComposeModal />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ToastContainer />
    </div>
  );
}
