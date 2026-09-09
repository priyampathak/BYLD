'use client';

import React from 'react';
import { SubmissionStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: SubmissionStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = (st: SubmissionStatus) => {
    switch (st) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Client Review':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'Interview':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Offer':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Placed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300/80 font-semibold';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Withdrawn':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const dotColor = (st: SubmissionStatus) => {
    switch (st) {
      case 'Submitted':
        return 'bg-blue-500';
      case 'Client Review':
        return 'bg-amber-500';
      case 'Interview':
        return 'bg-indigo-500';
      case 'Offer':
        return 'bg-purple-500';
      case 'Placed':
        return 'bg-emerald-500';
      case 'Rejected':
        return 'bg-rose-500';
      case 'Withdrawn':
        return 'bg-slate-400';
      default:
        return 'bg-slate-500';
    }
  };

  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border font-medium leading-none tracking-wide ${getStyles(
        status
      )} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor(status)} shrink-0`} />
      <span>{status}</span>
    </span>
  );
};
