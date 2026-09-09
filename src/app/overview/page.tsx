'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { SubmissionDetailDrawer } from '@/components/submissions/SubmissionDetailDrawer';
import { SubmissionWithDetails } from '@/lib/types';

export default function OverviewPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleCreated = () => {
      setRefreshKey((prev) => prev + 1);
    };
    window.addEventListener('byld:submission_created', handleCreated);
    return () => window.removeEventListener('byld:submission_created', handleCreated);
  }, []);

  const handleSelectSubmission = (sub: SubmissionWithDetails) => {
    setSelectedSubmission(sub);
    setIsDrawerOpen(true);
  };

  return (
    <AppShell
      title="Overview"
      description="Bird's-eye operational status of candidate submissions and active requisitions."
    >
      <div key={refreshKey}>
        <OverviewDashboard onSelectSubmission={handleSelectSubmission} />
      </div>

      <SubmissionDetailDrawer
        submission={selectedSubmission}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusUpdated={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </AppShell>
  );
}
