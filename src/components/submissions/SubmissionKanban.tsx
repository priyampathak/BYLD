'use client';

import React, { useState } from 'react';
import { SubmissionWithDetails, SubmissionStatus } from '@/lib/types';
import { StatusBadge } from '../ui/StatusBadge';
import { ShieldAlert, Building2, Calendar, User } from 'lucide-react';
import { repository } from '@/lib/db/repository';
import { useAuth } from '@/lib/context/AuthContext';
import { formatShortDate } from '@/lib/utils/formatDate';

interface SubmissionKanbanProps {
  submissions: SubmissionWithDetails[];
  onSelectSubmission: (submission: SubmissionWithDetails) => void;
  onStatusUpdated: () => void;
}

export const SubmissionKanban: React.FC<SubmissionKanbanProps> = ({
  submissions,
  onSelectSubmission,
  onStatusUpdated,
}) => {
  const { currentUser } = useAuth();
  const [draggedSubId, setDraggedSubId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<SubmissionStatus | null>(null);

  const KANBAN_COLUMNS: { status: SubmissionStatus; label: string; countColor: string }[] = [
    { status: 'Submitted', label: 'Submitted', countColor: 'bg-blue-100 text-blue-800' },
    { status: 'Client Review', label: 'Client Review', countColor: 'bg-amber-100 text-amber-800' },
    { status: 'Interview', label: 'Interview', countColor: 'bg-indigo-100 text-indigo-800' },
    { status: 'Offer', label: 'Offer', countColor: 'bg-purple-100 text-purple-800' },
    { status: 'Placed', label: 'Placed', countColor: 'bg-emerald-100 text-emerald-800' },
    { status: 'Rejected', label: 'Rejected', countColor: 'bg-rose-100 text-rose-800' },
    { status: 'Withdrawn', label: 'Withdrawn', countColor: 'bg-slate-200 text-slate-700' },
  ];

  const handleDragStart = (e: React.DragEvent, submissionId: string) => {
    setDraggedSubId(submissionId);
    e.dataTransfer.setData('text/plain', submissionId);
  };

  const handleDragOver = (e: React.DragEvent, status: SubmissionStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: SubmissionStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const subId = e.dataTransfer.getData('text/plain') || draggedSubId;
    if (!subId) return;

    const sub = submissions.find((s) => s.submission_id === subId);
    if (sub && sub.status !== targetStatus) {
      repository.updateStatus(
        subId,
        targetStatus,
        currentUser.id,
        `Status updated via Kanban drag to ${targetStatus}`
      );
      onStatusUpdated();
    }
    setDraggedSubId(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar min-h-[600px] items-start">
      {KANBAN_COLUMNS.map((col) => {
        const colSubmissions = submissions.filter((s) => s.status === col.status);
        const isTarget = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`w-72 shrink-0 rounded-xl border p-3 flex flex-col transition-all duration-150 ${
              isTarget
                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300/40'
                : 'bg-slate-100/60 border-slate-200/80'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">{col.label}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.countColor}`}
              >
                {colSubmissions.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 space-y-3 min-h-[150px]">
              {colSubmissions.length === 0 ? (
                <div className="h-full min-h-[100px] flex items-center justify-center border border-dashed border-slate-300 rounded-lg text-slate-400 text-[11px]">
                  No items
                </div>
              ) : (
                colSubmissions.map((sub) => (
                  <div
                    key={sub.submission_id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, sub.submission_id)}
                    onClick={() => onSelectSubmission(sub)}
                    className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group space-y-2.5 relative"
                  >
                    {/* Top Row: Candidate & Duplicate Pill */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {sub.candidate.name}
                      </h4>
                      {sub.duplicate_flag && (
                        <span className="p-1 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold shrink-0" title={sub.duplicate_reason || 'Duplicate'}>
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        </span>
                      )}
                    </div>

                    {/* Job / Requisition Title */}
                    <div className="text-[11px] font-semibold text-slate-700 leading-snug">
                      {sub.requisition.title}
                    </div>

                    {/* Client & AM info */}
                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{sub.client.name}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-1.5">
                          <img
                            src={sub.submitter.avatar}
                            alt={sub.submitter.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-[10px] font-medium text-slate-700 truncate">{sub.submitter.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {formatShortDate(sub.submitted_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
