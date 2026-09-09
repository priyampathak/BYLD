'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  AlertTriangle,
  Building2,
  Briefcase,
  UserCheck,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  FolderGit2,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewSubmission?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenNewSubmission }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchUser, logout, allUsers } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    {
      label: 'Overview',
      href: '/overview',
      icon: LayoutDashboard,
    },
    {
      label: 'Submissions',
      href: '/submissions',
      icon: Layers,
      subItems: [
        { label: 'All Submissions', href: '/submissions?filter=all' },
        { label: 'My Submissions', href: '/submissions?filter=my' },
        { label: 'Flagged Duplicates', href: '/submissions?filter=flagged', badge: 'Audit' },
      ],
    },
  ];

  const workspaceItems = [
    { label: 'Clients', href: '/clients', icon: Building2 },
    { label: 'Requisitions', href: '/requisitions', icon: Briefcase },
  ];

  const isActive = (href: string) => {
    if (href === '/overview' && pathname === '/overview') return true;
    if (href === '/submissions' && pathname === '/submissions') return true;
    return false;
  };

  const isSubActive = (href: string) => {
    if (typeof window === 'undefined') return false;
    const currentUrl = pathname + (window.location.search || '');
    return currentUrl === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-slate-200 bg-slate-900 text-slate-100 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
          <Link href="/overview" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-lg shadow-sm group-hover:bg-blue-500 transition-colors">
              B
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight text-base leading-none block">
                BYLD
              </span>
              <span className="text-[11px] text-slate-400 font-normal tracking-wide leading-none block mt-1">
                Submission Tracker
              </span>
            </div>
          </Link>
        </div>

        {/* Primary CTA */}
        <div className="p-4">
          <button
            onClick={() => {
              if (onOpenNewSubmission) onOpenNewSubmission();
            }}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2.5 rounded-md font-medium text-sm transition-all shadow-sm active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ New Submission</span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Core Platform
            </div>

            {/* Overview */}
            <Link
              href="/overview"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/overview' || pathname === '/'
                  ? 'bg-slate-800 text-white border-l-2 border-blue-500'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Overview</span>
            </Link>

            {/* Submissions Section */}
            <div className="pt-1">
              <Link
                href="/submissions"
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/submissions')
                    ? 'bg-slate-800/80 text-white'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Submissions</span>
                </div>
              </Link>

              {/* Sub-items */}
              <div className="ml-4 pl-3 border-l border-slate-800 mt-1 space-y-1">
                <Link
                  href="/submissions?filter=all"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <span>All Submissions</span>
                </Link>
                <Link
                  href="/submissions?filter=my"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <span>My Submissions</span>
                </Link>
                <Link
                  href="/submissions?filter=flagged"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-amber-400 hover:bg-amber-400/10"
                >
                  <div className="flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Flagged Duplicates</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Workspace Reference Section */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Workspace
            </div>

            {workspaceItems.map((item) => {
              const ItemIcon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-slate-800 text-white border-l-2 border-blue-500'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <ItemIcon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Switcher / Persona Area */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 relative">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-1.5 px-1">
            Active Demo Persona
          </div>
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </button>

          {/* Persona Menu Dropdown */}
          {showPersonaMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-2 border-b border-slate-800 text-[11px] font-medium text-slate-400">
                Switch Persona to Test Roles:
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                      user.id === currentUser.id ? 'bg-slate-800/80 text-blue-400 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 truncate capitalize">{user.role.replace('_', ' ')}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <Link
                  href="/login"
                  onClick={() => setShowPersonaMenu(false)}
                  className="text-xs text-blue-400 hover:underline py-1"
                >
                  View All Accounts
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Explicit Logout Button below card */}
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center space-x-2 p-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-rose-950/30 hover:border-rose-800/60 border border-slate-800 transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400" />
            <span>Logout to Login Screen</span>
          </button>
        </div>
      </aside>
    </>
  );
};
