'use client';

import React from 'react';
import { SubmissionWithDetails, SubmissionStatus } from '@/lib/types';
import { StatusBadge } from '../ui/StatusBadge';
import { ShieldAlert, ArrowUpRight, ChevronRight, User } from 'lucide-react';
import { formatShortDate } from '@/lib/utils/formatDate';

interface SubmissionTableProps {
  submissions: SubmissionWithDetails[];
  onSelectSubmission: (submission: SubmissionWithDetails) => void;
  onQuickStatusChange?: (submissionId: string, status: SubmissionStatus) => void;
}

export const SubmissionTable: React.FC<SubmissionTableProps> = ({
  submissions,
  onSelectSubmission,
  onQuickStatusChange,
}) => {
  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatShortDate(date);
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-dashed border-slate-300 rounded-xl bg-white/50">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No submissions found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Try adjusting your search criteria or filters, or create a new candidate submission.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Candidate</th>
              <th className="py-3.5 px-4">Requisition</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Account Manager</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Submitted</th>
              <th className="py-3.5 px-4">Last Updated</th>
              <th className="py-3.5 px-4 text-center">Duplicate</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {submissions.map((sub) => {
              const latestUpdate = sub.status_history[0]?.changed_at || sub.submitted_at;
              return (
                <tr
                  key={sub.submission_id}
                  onClick={() => onSelectSubmission(sub)}
                  className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                >
                  {/* Candidate */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {sub.candidate.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {sub.candidate.email}
                    </div>
                  </td>

                  {/* Requisition */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{sub.requisition.title}</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{sub.requisition.code}</div>
                  </td>

                  {/* Client */}
                  <td className="py-3 px-4 text-slate-700">{sub.client.name}</td>

                  {/* Account Manager */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={sub.submitter.avatar}
                        alt={sub.submitter.name}
                        className="w-5 h-5 rounded-full object-cover shrink-0"
                      />
                      <span className="text-slate-800 font-medium">{sub.submitter.name}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={sub.status} size="sm" />
                  </td>

                  {/* Submitted */}
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {formatShortDate(sub.submitted_at)}
                  </td>

                  {/* Last Updated */}
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {getRelativeTime(latestUpdate)}
                  </td>

                  {/* Duplicate */}
                  <td className="py-3 px-4 text-center">
                    {sub.duplicate_flag ? (
                      <span
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300"
                        title={sub.duplicate_reason || 'Flagged duplicate'}
                      >
                        <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Flagged</span>
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <span className="text-slate-400 group-hover:text-blue-600 transition-colors inline-block">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
