'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NewSubmissionModal } from '../submissions/NewSubmissionModal';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, title, description }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewSubmissionOpen, setIsNewSubmissionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex text-slate-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
          title={title}
          description={description}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Global New Submission Modal */}
      {isNewSubmissionOpen && (
        <NewSubmissionModal
          isOpen={isNewSubmissionOpen}
          onClose={() => setIsNewSubmissionOpen(false)}
          onSuccess={() => {
            setIsNewSubmissionOpen(false);
            // Trigger custom event so any active page/view re-fetches or refreshes state cleanly!
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('byld:submission_created'));
            }
          }}
        />
      )}
    </div>
  );
};
