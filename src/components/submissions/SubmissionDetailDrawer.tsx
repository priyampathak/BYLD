'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  ShieldAlert,
  History,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { SubmissionWithDetails, SubmissionStatus } from '@/lib/types';
import { StatusBadge } from '../ui/StatusBadge';
import { repository } from '@/lib/db/repository';
import { useAuth } from '@/lib/context/AuthContext';
import { formatDateTime } from '@/lib/utils/formatDate';

interface SubmissionDetailDrawerProps {
  submission: SubmissionWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const SubmissionDetailDrawer: React.FC<SubmissionDetailDrawerProps> = ({
  submission,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const { currentUser } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus | ''>('');
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !submission) return null;

  const ALL_STATUSES: SubmissionStatus[] = [
    'Submitted',
    'Client Review',
    'Interview',
    'Offer',
    'Placed',
    'Rejected',
    'Withdrawn',
  ];

  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SubmissionStatus;
    if (val && val !== submission.status) {
      setSelectedStatus(val);
      setShowStatusConfirm(true);
    }
  };

  const handleConfirmStatusChange = () => {
    if (!selectedStatus) return;
    setIsUpdating(true);
    try {
      repository.updateStatus(
        submission.submission_id,
        selectedStatus,
        currentUser.id,
        statusNote.trim() || undefined
      );
      setIsUpdating(false);
      setShowStatusConfirm(false);
      setStatusNote('');
      setSelectedStatus('');
      onStatusUpdated();
    } catch (err) {
      console.error('Status update failed:', err);
      setIsUpdating(false);
    }
  };

  const formattedSubmittedDate = formatDateTime(submission.submitted_at);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Top Bar / Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
            <div className="space-y-1 pr-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">{submission.candidate.name}</h2>
                {submission.duplicate_flag && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                    <span>Duplicate Flag</span>
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-600">
                {submission.requisition.title} ({submission.requisition.code})
              </p>
              <p className="text-xs text-slate-500 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{submission.client.name}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Status Selector Section */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Submission Status
              </label>
              <div className="flex items-center space-x-3">
                <StatusBadge status={submission.status} />
                <span className="text-xs text-slate-400">→</span>
                <select
                  value={submission.status}
                  onChange={handleStatusSelect}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Flagged Duplicate Reason Audit Box (if applicable) */}
            {submission.duplicate_flag && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Flagged Duplicate Audit Details</span>
                </div>
                <div className="space-y-1 pl-6 text-slate-800">
                  <p><span className="font-semibold text-slate-600">Reason:</span> {submission.duplicate_reason || 'N/A'}</p>
                  {submission.duplicate_override_by && (
                    <p><span className="font-semibold text-slate-600">Override Authorized By:</span> {repository.getUserById(submission.duplicate_override_by)?.name || submission.duplicate_override_by}</p>
                  )}
                  {submission.original_submission_id && (
                    <p><span className="font-semibold text-slate-600">Original Submission ID:</span> #{submission.original_submission_id}</p>
                  )}
                </div>
              </div>
            )}

            {/* Candidate Info Card */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidate Information</h3>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2.5 text-xs text-slate-800">
                <div className="flex items-center space-x-2.5">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900">{submission.candidate.name}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${submission.candidate.email}`} className="text-blue-600 hover:underline">
                    {submission.candidate.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{submission.candidate.phone}</span>
                </div>
                {submission.candidate.primary_skill && (
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Skills:</span>
                    <span className="font-medium text-slate-700">{submission.candidate.primary_skill}</span>
                  </div>
                )}
                {submission.candidate.location && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-slate-700">{submission.candidate.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Metadata */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submission Details</h3>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Submitted By:</span>
                  <span className="font-medium text-slate-900">{submission.submitter.name} ({submission.submitter.role.replace('_', ' ')})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Date Submitted:</span>
                  <span className="text-slate-700">{formattedSubmittedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Requisition:</span>
                  <span className="font-medium text-slate-900">{submission.requisition.code} - {submission.requisition.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Client:</span>
                  <span className="font-medium text-slate-900">{submission.client.name}</span>
                </div>
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Status History</span>
                </h3>
                <span className="text-[11px] text-slate-400">{submission.status_history.length} updates</span>
              </div>

              <div className="relative pl-5 border-l-2 border-slate-200 space-y-4">
                {submission.status_history.map((hist, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline dot */}
                    <span className={`absolute -left-[25px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${
                      idx === 0 ? 'bg-blue-600' : 'bg-slate-300'
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <StatusBadge status={hist.status} size="sm" />
                        <span className="text-[11px] text-slate-400 font-normal">
                          {formatDateTime(hist.changed_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium mt-1">
                        Updated by <span className="font-semibold text-slate-900">{hist.changed_by_name}</span>
                      </p>
                      {hist.note && (
                        <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md mt-1 italic border border-slate-100">
                          "{hist.note}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Confirmation Modal for Status Change */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900">Confirm Status Change</h3>
            <div className="flex items-center justify-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <StatusBadge status={submission.status} size="sm" />
              <ArrowRight className="w-4 h-4 text-slate-400" />
              {selectedStatus && <StatusBadge status={selectedStatus} size="sm" />}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Note / Comment (Optional)
              </label>
              <textarea
                placeholder="e.g. Cleared round 1 tech interview with client..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={2}
                className="w-full p-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowStatusConfirm(false);
                  setSelectedStatus('');
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={isUpdating}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
