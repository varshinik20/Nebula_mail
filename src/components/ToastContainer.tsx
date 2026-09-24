'use client';

import React from 'react';
import { useMailStore } from '@/lib/mailStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useMailStore();

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="pointer-events-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl backdrop-blur-md flex items-start justify-between space-x-3 text-xs"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 mt-0.5 font-bold">
                {notif.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : notif.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                ) : (
                  <Bell className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{notif.title}</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed font-medium">{notif.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
