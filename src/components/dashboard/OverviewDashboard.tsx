'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  CheckCircle2,
  Users,
  Award,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building2,
  UserCheck,
} from 'lucide-react';
import { repository } from '@/lib/db/repository';
import { SubmissionWithDetails, SubmissionStatus } from '@/lib/types';
import { StatusBadge } from '../ui/StatusBadge';
import { formatShortDate } from '@/lib/utils/formatDate';

interface OverviewDashboardProps {
  onSelectSubmission: (submission: SubmissionWithDetails) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onSelectSubmission }) => {
  const router = useRouter();
  const submissions = repository.getSubmissions();

  const totalCount = submissions.length;
  const activeCount = submissions.filter((s) =>
    ['Submitted', 'Client Review', 'Interview', 'Offer'].includes(s.status)
  ).length;
  const interviewCount = submissions.filter((s) => s.status === 'Interview').length;
  const offerCount = submissions.filter((s) => s.status === 'Offer').length;
  const placedCount = submissions.filter((s) => s.status === 'Placed').length;
  const flaggedCount = submissions.filter((s) => s.duplicate_flag).length;

  const pipelineCounts: Record<SubmissionStatus, number> = {
    Submitted: submissions.filter((s) => s.status === 'Submitted').length,
    'Client Review': submissions.filter((s) => s.status === 'Client Review').length,
    Interview: interviewCount,
    Offer: offerCount,
    Placed: placedCount,
    Rejected: submissions.filter((s) => s.status === 'Rejected').length,
    Withdrawn: submissions.filter((s) => s.status === 'Withdrawn').length,
  };

  const recentSubmissions = submissions.slice(0, 5);

  const flaggedSubmissions = submissions.filter((s) => s.duplicate_flag);

  const navigateToFiltered = (params: string) => {
    router.push(`/submissions?${params}`);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Submissions */}
        <button
          onClick={() => navigateToFiltered('filter=all')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
            <Layers className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">All candidates</p>
        </button>

        {/* Active Submissions */}
        <button
          onClick={() => navigateToFiltered('status=active')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-900">{activeCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">In progress</p>
        </button>

        {/* Interviews */}
        <button
          onClick={() => navigateToFiltered('status=Interview')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
            <Users className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-indigo-900">{interviewCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Round 1 / 2</p>
        </button>

        {/* Offers */}
        <button
          onClick={() => navigateToFiltered('status=Offer')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Offers</span>
            <Award className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{offerCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Pending join</p>
        </button>

        {/* Placed */}
        <button
          onClick={() => navigateToFiltered('status=Placed')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Placed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-emerald-900">{placedCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Successfully hired</p>
        </button>

        {/* Flagged Duplicates */}
        <button
          onClick={() => navigateToFiltered('filter=flagged')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">Flagged</span>
            <ShieldAlert className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-rose-900">{flaggedCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Audit required</p>
        </button>

      </div>

      {/* Grid: Pipeline Summary + Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pipeline Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Submission Pipeline</span>
            </h3>
            <span className="text-xs text-slate-400">v1 Status Breakdown</span>
          </div>

          <div className="space-y-2.5 py-4 flex-1">
            {(Object.keys(pipelineCounts) as SubmissionStatus[]).map((st) => {
              const count = pipelineCounts[st];
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <button
                  key={st}
                  onClick={() => navigateToFiltered(`status=${st}`)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-2.5">
                    <StatusBadge status={st} size="sm" />
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600">{count}</span>
                    <span className="text-[10px] text-slate-400 w-8 text-right">{pct}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/submissions"
              className="w-full flex items-center justify-center space-x-1 text-xs text-blue-600 font-semibold hover:underline"
            >
              <span>View full submissions view</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Needs Attention / Flagged Audit Highlights */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Needs Attention — Flagged Duplicates</h3>
            </div>
            <Link
              href="/submissions?filter=flagged"
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              Audit All ({flaggedSubmissions.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {flaggedSubmissions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No flagged duplicates requiring review.</p>
            ) : (
              flaggedSubmissions.slice(0, 3).map((sub) => (
                <div
                  key={sub.submission_id}
                  onClick={() => onSelectSubmission(sub)}
                  className="p-3.5 rounded-lg border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{sub.candidate.name}</span>
                      <span className="text-[10px] text-slate-500">• {sub.requisition.title}</span>
                    </div>
                    <StatusBadge status={sub.status} size="sm" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-600">Override Reason: </span>
                    <span className="italic">"{sub.duplicate_reason || 'N/A'}"</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Submitted by <strong className="text-slate-800">{sub.submitter.name}</strong></span>
                    <span>{formatShortDate(sub.submitted_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Recent Submissions List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Recent Candidate Submissions</h3>
          <Link href="/submissions" className="text-xs text-blue-600 font-semibold hover:underline">
            View All Submissions →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentSubmissions.map((sub) => (
            <div
              key={sub.submission_id}
              onClick={() => onSelectSubmission(sub)}
              className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900">{sub.candidate.name}</span>
                  {sub.duplicate_flag && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Duplicate Flag
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                  <span>{sub.requisition.title}</span>
                  <span>•</span>
                  <span>{sub.client.name}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-medium text-slate-800">{sub.submitter.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {formatShortDate(sub.submitted_at)}
                  </div>
                </div>
                <StatusBadge status={sub.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
