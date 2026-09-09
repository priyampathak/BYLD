'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Sparkles, CheckCircle2, UserCheck, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { SEED_USERS } from '@/lib/db/seedData';

export default function LoginPage() {
  const router = useRouter();
  const { switchUser } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState('priya@byld.demo');
  const [password, setPassword] = useState('demo123');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = SEED_USERS.find((u) => u.email === selectedEmail);
    if (found) {
      switchUser(found.id);
      router.push('/overview');
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    router.push('/overview');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-2xl shadow-lg mb-4">
          B
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">BYLD Submission Tracker</h1>
        <p className="mt-1.5 text-xs text-slate-400 max-w-sm mx-auto">
          Internal operational source of truth for candidate submissions, duplicate prevention, and status tracking.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-950/80 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-8 space-y-6">
          
          {/* Demo Login Selector Banner */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Prototype Demo Accounts</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Click any demo account below to instantly switch role personas and explore the application.
            </p>
          </div>

          {/* Quick Demo Persona Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SEED_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user.id)}
                className="flex items-start space-x-3 p-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/80 hover:border-blue-500/50 transition-all text-left group"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-blue-500 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {user.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-[11px] text-slate-400 capitalize font-medium">
                    {user.role.replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{user.email}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Standard Form Fallback */}
          <div className="pt-4 border-t border-slate-800/80">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Enter Submission Tracker</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
