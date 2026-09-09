'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Plus, User, ShieldCheck, Sparkles, UserCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface TopbarProps {
  onOpenSidebar: () => void;
  onOpenNewSubmission?: () => void;
  title?: string;
  description?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenSidebar,
  onOpenNewSubmission,
  title = 'Submission Tracker',
  description,
}) => {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'account_manager':
        return { label: 'Account Manager', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'ops_delivery':
        return { label: 'Ops / Delivery', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'sales_leadership':
        return { label: 'Sales / Leadership', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'Admin', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md lg:hidden hover:bg-slate-100"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 truncate tracking-tight">{title}</h1>
          {description && (
            <p className="text-xs text-slate-500 truncate hidden sm:block">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Role Pill Indicator */}
        <div className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleInfo.bg}`}>
          <UserCheck className="w-3.5 h-3.5" />
          <span>{roleInfo.label}</span>
        </div>

        {/* User Avatar + Name */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-slate-900 leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 capitalize">{currentUser.title}</div>
          </div>
        </div>

        {/* Header Action CTA */}
        {onOpenNewSubmission && (
          <button
            onClick={onOpenNewSubmission}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Submission</span>
          </button>
        )}

        {/* Topbar Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Logout to Login Screen"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
