'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { repository } from '@/lib/db/repository';
import { Briefcase, Building2, Plus, MapPin, Layers } from 'lucide-react';
import Link from 'next/link';

export default function RequisitionsPage() {
  const requisitions = repository.getRequisitions();
  const clients = repository.getClients();
  const submissions = repository.getSubmissions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.client_id || '');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !clientId) return;
    repository.createRequisition(
      reqTitle.trim(),
      clientId,
      code.trim() || undefined,
      undefined,
      location.trim() || undefined
    );
    setReqTitle('');
    setCode('');
    setLocation('');
    setShowAddModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AppShell
      title="Requisitions"
      description="Active job roles and open staffing requests across client accounts."
    >
      <div className="space-y-6" key={refreshKey}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Job Requisitions</h2>
            <p className="text-xs text-slate-500">Active positions open for candidate submissions.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Requisition</span>
          </button>
        </div>

        {/* Requisitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requisitions.map((req) => {
            const client = clients.find((c) => c.client_id === req.client_id);
            const reqSubs = submissions.filter((s) => s.requisition_id === req.requisition_id);
            const activeSubsCount = reqSubs.filter((s) =>
              ['Submitted', 'Client Review', 'Interview', 'Offer'].includes(s.status)
            ).length;

            return (
              <div
                key={req.requisition_id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {req.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">{req.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{client ? client.name : 'Unknown Client'}</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {req.status}
                  </span>
                </div>

                {req.location && (
                  <div className="text-xs text-slate-500 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.location}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Total Subs</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{reqSubs.length}</div>
                  </div>

                  <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                    <div className="text-amber-700 text-[10px] uppercase font-bold">Active Subs</div>
                    <div className="text-sm font-bold text-amber-900 mt-0.5">{activeSubsCount}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/submissions?filter=all`}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center justify-between"
                  >
                    <span>View candidate submissions</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Requisition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Create New Requisition</h3>
            <form onSubmit={handleAddRequisition} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Requisition Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Backend Engineer"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Client *</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.client_id} value={c.client_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Req Code</label>
                  <input
                    type="text"
                    placeholder="REQ-305"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Bengaluru"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold"
                >
                  Save Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
