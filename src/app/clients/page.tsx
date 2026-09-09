'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { repository } from '@/lib/db/repository';
import { Building2, Briefcase, Users, Plus, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ClientsPage() {
  const clients = repository.getClients();
  const requisitions = repository.getRequisitions();
  const submissions = repository.getSubmissions();

  const [newClientName, setNewClientName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    repository.createClient(newClientName.trim(), newIndustry.trim() || undefined);
    setNewClientName('');
    setNewIndustry('');
    setShowAddModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AppShell
      title="Clients"
      description="Reference directory of active corporate clients and hiring partners."
    >
      <div className="space-y-6" key={refreshKey}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Clients Directory</h2>
            <p className="text-xs text-slate-500">Manage client organizations and active requisitions.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => {
            const clientReqs = requisitions.filter((r) => r.client_id === client.client_id);
            const clientSubs = submissions.filter((s) => s.client.client_id === client.client_id);

            return (
              <div
                key={client.client_id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{client.name}</h3>
                      <p className="text-xs text-slate-500">{client.industry || 'Enterprise'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Requisitions</div>
                    <div className="text-base font-bold text-slate-800 mt-0.5">{clientReqs.length}</div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Submissions</div>
                    <div className="text-base font-bold text-slate-800 mt-0.5">{clientSubs.length}</div>
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

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Client Organization</h3>
            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Client Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy Tech"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Industry</label>
                <input
                  type="text"
                  placeholder="e.g. Consumer Tech / Logistics"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20"
                />
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
