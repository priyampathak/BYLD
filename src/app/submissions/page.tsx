'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { SubmissionTable } from '@/components/submissions/SubmissionTable';
import { SubmissionKanban } from '@/components/submissions/SubmissionKanban';
import { SubmissionFilters, FilterState } from '@/components/submissions/SubmissionFilters';
import { SubmissionDetailDrawer } from '@/components/submissions/SubmissionDetailDrawer';
import { repository } from '@/lib/db/repository';
import { useAuth } from '@/lib/context/AuthContext';
import { SubmissionWithDetails, SubmissionStatus } from '@/lib/types';
import { ShieldAlert, Plus, Layers } from 'lucide-react';

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const { currentUser, isAccountManager } = useAuth();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Initial Filter Setup
  const initialAmId = useMemo(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'my') return currentUser.id;
    if (filterParam === 'all') return 'all';
    return isAccountManager ? currentUser.id : 'all';
  }, [searchParams, currentUser.id, isAccountManager]);

  const initialDuplicateOnly = useMemo(() => {
    return searchParams.get('filter') === 'flagged';
  }, [searchParams]);

  const initialStatus = useMemo(() => {
    const statusParam = searchParams.get('status');
    if (statusParam === 'active') return 'active';
    return statusParam || 'all';
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    amId: initialAmId,
    clientId: 'all',
    requisitionId: 'all',
    status: initialStatus,
    duplicateOnly: initialDuplicateOnly,
  });

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'kanban') setViewMode('kanban');
    if (viewParam === 'table') setViewMode('table');

    const filterParam = searchParams.get('filter');
    if (filterParam === 'my') setFilters((prev) => ({ ...prev, amId: currentUser.id }));
    if (filterParam === 'all') setFilters((prev) => ({ ...prev, amId: 'all' }));
    if (filterParam === 'flagged') setFilters((prev) => ({ ...prev, duplicateOnly: true }));

    const statusParam = searchParams.get('status');
    if (statusParam) setFilters((prev) => ({ ...prev, status: statusParam }));
  }, [searchParams, currentUser.id]);

  useEffect(() => {
    const handleCreated = () => {
      setRefreshKey((prev) => prev + 1);
    };
    window.addEventListener('byld:submission_created', handleCreated);
    return () => window.removeEventListener('byld:submission_created', handleCreated);
  }, []);

  const allSubmissions = useMemo(() => {
    return repository.getSubmissions();
  }, [refreshKey]);

  const users = useMemo(() => repository.getUsers(), []);
  const clients = useMemo(() => repository.getClients(), []);
  const requisitions = useMemo(() => repository.getRequisitions(), []);

  // Filter Logic
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter((sub) => {
      // 1. Search Query (Candidate Name / Email / Phone / Skill)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.trim().toLowerCase();
        const candName = sub.candidate.name.toLowerCase();
        const candEmail = sub.candidate.email.toLowerCase();
        const candPhone = sub.candidate.phone.toLowerCase();
        const skill = (sub.candidate.primary_skill || '').toLowerCase();
        const reqTitle = sub.requisition.title.toLowerCase();

        const match =
          candName.includes(query) ||
          candEmail.includes(query) ||
          candPhone.includes(query) ||
          skill.includes(query) ||
          reqTitle.includes(query);

        if (!match) return false;
      }

      // 2. AM Filter
      if (filters.amId !== 'all') {
        if (sub.submitted_by !== filters.amId) return false;
      }

      // 3. Client Filter
      if (filters.clientId !== 'all') {
        if (sub.requisition.client_id !== filters.clientId) return false;
      }

      // 4. Requisition Filter
      if (filters.requisitionId !== 'all') {
        if (sub.requisition_id !== filters.requisitionId) return false;
      }

      // 5. Status Filter
      if (filters.status !== 'all') {
        if (filters.status === 'active') {
          if (!['Submitted', 'Client Review', 'Interview', 'Offer'].includes(sub.status)) {
            return false;
          }
        } else if (sub.status !== filters.status) {
          return false;
        }
      }

      // 6. Flagged Duplicate Filter
      if (filters.duplicateOnly) {
        if (!sub.duplicate_flag) return false;
      }

      return true;
    });
  }, [allSubmissions, filters]);

  // Counts summary for top header chips
  const totalFilteredCount = filteredSubmissions.length;
  const clientReviewCount = filteredSubmissions.filter((s) => s.status === 'Client Review').length;
  const interviewCount = filteredSubmissions.filter((s) => s.status === 'Interview').length;
  const offerCount = filteredSubmissions.filter((s) => s.status === 'Offer').length;
  const placedCount = filteredSubmissions.filter((s) => s.status === 'Placed').length;
  const flaggedCount = filteredSubmissions.filter((s) => s.duplicate_flag).length;

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      amId: 'all',
      clientId: 'all',
      requisitionId: 'all',
      status: 'all',
      duplicateOnly: false,
    });
  };

  const handleSelectSubmission = (sub: SubmissionWithDetails) => {
    setSelectedSubmission(sub);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & KPI Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Candidate Submissions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track candidate submissions across clients and requisitions in real time.
          </p>
        </div>

        {/* Compact KPI Count Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
            {totalFilteredCount} Total
          </span>
          <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs">
            {clientReviewCount} Client Review
          </span>
          <span className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 shadow-2xs">
            {interviewCount} Interview
          </span>
          <span className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 shadow-2xs">
            {offerCount} Offer
          </span>
          {flaggedCount > 0 && (
            <span className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 shadow-2xs flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>{flaggedCount} Flagged</span>
            </span>
          )}
        </div>
      </div>

      {/* Toolbar & Filters */}
      <SubmissionFilters
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={resetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        users={users}
        clients={clients}
        requisitions={requisitions}
        totalCount={totalFilteredCount}
      />

      {/* Primary Representation View: Table vs Kanban */}
      {viewMode === 'table' ? (
        <SubmissionTable
          submissions={filteredSubmissions}
          onSelectSubmission={handleSelectSubmission}
        />
      ) : (
        <SubmissionKanban
          submissions={filteredSubmissions}
          onSelectSubmission={handleSelectSubmission}
          onStatusUpdated={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {/* Detail Drawer */}
      <SubmissionDetailDrawer
        submission={selectedSubmission}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusUpdated={() => setRefreshKey((prev) => prev + 1)}
      />

    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <AppShell
      title="Submissions"
      description="Operational management of candidate submissions, status updates, and duplicate audits."
    >
      <Suspense fallback={<div className="p-8 text-xs text-slate-500">Loading submissions...</div>}>
        <SubmissionsContent />
      </Suspense>
    </AppShell>
  );
}
