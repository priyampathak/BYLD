'use client';

import React from 'react';
import { Search, X, Filter, RefreshCw, LayoutList, Kanban, ShieldAlert } from 'lucide-react';
import { User, Client, Requisition, SubmissionStatus } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';

export interface FilterState {
  searchQuery: string;
  amId: string; // 'all' | 'me' | user_id
  clientId: string; // 'all' | client_id
  requisitionId: string; // 'all' | requisition_id
  status: string; // 'all' | SubmissionStatus
  duplicateOnly: boolean;
}

interface SubmissionFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  viewMode: 'table' | 'kanban';
  onViewModeChange: (mode: 'table' | 'kanban') => void;
  users: User[];
  clients: Client[];
  requisitions: Requisition[];
  totalCount: number;
}

export const SubmissionFilters: React.FC<SubmissionFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  users,
  clients,
  requisitions,
  totalCount,
}) => {
  const { currentUser } = useAuth();

  const STATUSES: SubmissionStatus[] = [
    'Submitted',
    'Client Review',
    'Interview',
    'Offer',
    'Placed',
    'Rejected',
    'Withdrawn',
  ];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.amId !== 'all' ||
    filters.clientId !== 'all' ||
    filters.requisitionId !== 'all' ||
    filters.status !== 'all' ||
    filters.duplicateOnly;

  return (
    <div className="space-y-3 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
      {/* Top Toolbar Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, email, or skill..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side: View Toggle (Table / Kanban) */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center space-x-1 text-xs">
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>

            <button
              onClick={() => onViewModeChange('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
        
        {/* AM Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Account Manager
          </label>
          <select
            value={filters.amId}
            onChange={(e) => onFilterChange({ ...filters, amId: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All AMs</option>
            <option value={currentUser.id}>Me ({currentUser.name})</option>
            {users
              .filter((u) => u.id !== currentUser.id)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>

        {/* Client Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Client
          </label>
          <select
            value={filters.clientId}
            onChange={(e) => onFilterChange({ ...filters, clientId: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.client_id} value={c.client_id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Requisition Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Requisition
          </label>
          <select
            value={filters.requisitionId}
            onChange={(e) => onFilterChange({ ...filters, requisitionId: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Requisitions</option>
            {requisitions.map((r) => (
              <option key={r.requisition_id} value={r.requisition_id}>
                {r.code} - {r.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Flagged Duplicate Filter Toggle */}
        <div className="col-span-2 sm:col-span-1 flex items-end">
          <button
            onClick={() => onFilterChange({ ...filters, duplicateOnly: !filters.duplicateOnly })}
            className={`w-full flex items-center justify-center space-x-1.5 p-2 rounded-lg border text-xs font-semibold transition-all ${
              filters.duplicateOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Flagged Duplicates Only</span>
          </button>
        </div>

      </div>

      {/* Active Filter Chips & Clear Action */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-medium mr-1">Active filters:</span>

            {filters.amId !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                AM: {users.find((u) => u.id === filters.amId)?.name || filters.amId}
              </span>
            )}

            {filters.clientId !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                Client: {clients.find((c) => c.client_id === filters.clientId)?.name}
              </span>
            )}

            {filters.requisitionId !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                Req: {requisitions.find((r) => r.requisition_id === filters.requisitionId)?.code}
              </span>
            )}

            {filters.status !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                Status: {filters.status}
              </span>
            )}

            {filters.duplicateOnly && (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 font-semibold">
                Flagged Duplicates
              </span>
            )}
          </div>

          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 text-slate-500 hover:text-slate-900 font-medium text-xs ml-auto shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
