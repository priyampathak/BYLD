'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, UserCheck, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { repository } from '@/lib/db/repository';
import { Requisition, DuplicateCheckResult, SubmissionWithDetails } from '@/lib/types';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate, formatShortDate } from '@/lib/utils/formatDate';

interface NewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSelectExistingSubmission?: (sub: SubmissionWithDetails) => void;
}

export const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSelectExistingSubmission,
}) => {
  const { currentUser } = useAuth();

  // Form State
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateLocation, setCandidateLocation] = useState('');
  const [candidateSkill, setCandidateSkill] = useState('');
  const [requisitionId, setRequisitionId] = useState('');
  const [selectedClientName, setSelectedClientName] = useState('');

  // Requisitions list
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);

  // Duplicate Check Modal States
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null);
  const [duplicateReasonCategory, setDuplicateReasonCategory] = useState<'Different role' | 'Circumstances changed after rejection' | 'Other'>('Different role');
  const [otherReasonText, setOtherReasonText] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const reqs = repository.getRequisitions();
      setRequisitions(reqs);
      if (reqs.length > 0 && !requisitionId) {
        setRequisitionId(reqs[0].requisition_id);
        const client = repository.getClientById(reqs[0].client_id);
        setSelectedClientName(client ? client.name : '');
      }
    }
  }, [isOpen]);

  const handleRequisitionChange = (reqId: string) => {
    setRequisitionId(reqId);
    const req = requisitions.find((r) => r.requisition_id === reqId);
    if (req) {
      const client = repository.getClientById(req.client_id);
      setSelectedClientName(client ? client.name : '');
    } else {
      setSelectedClientName('');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!candidateName.trim()) errors.candidateName = 'Candidate name is required';
    if (!candidateEmail.trim()) {
      errors.candidateEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(candidateEmail)) {
      errors.candidateEmail = 'Invalid email format';
    }
    if (!candidatePhone.trim()) errors.candidatePhone = 'Phone number is required';
    if (!requisitionId) errors.requisitionId = 'Requisition selection is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInitialSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Check duplicate
    const check = repository.checkDuplicate(candidateEmail, candidatePhone, requisitionId);

    if (check.type !== 'NONE') {
      setDuplicateCheck(check);
      return;
    }

    // Save directly if no duplicate
    executeSubmissionSave(false, null);
  };

  const executeSubmissionSave = (isOverride: boolean, reason: string | null) => {
    setIsSubmitting(true);
    try {
      repository.createSubmission({
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
        candidatePhone: candidatePhone.trim(),
        candidateLocation: candidateLocation.trim() || undefined,
        candidateSkill: candidateSkill.trim() || undefined,
        requisitionId,
        submittedByUserId: currentUser.id,
        duplicateReason: isOverride ? reason : null,
        isDuplicateConfirmed: isOverride,
      });

      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      console.error('Submission create error:', err);
      setIsSubmitting(false);
    }
  };

  const handleConfirmDuplicateSave = () => {
    let finalReason = duplicateReasonCategory;
    if (duplicateReasonCategory === 'Other') {
      if (!otherReasonText.trim()) {
        setFormErrors({ otherReason: 'Please explain the reason for resubmitting' });
        return;
      }
      finalReason = `Other: ${otherReasonText.trim()}` as any;
    }
    executeSubmissionSave(true, finalReason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">New Candidate Submission</h2>
            <p className="text-xs text-slate-500">Submit a candidate to an active requisition.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleInitialSave} className="p-6 space-y-4">
          
          {/* Submitter Info derived automatically */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs">
            <div className="flex items-center space-x-2 text-blue-900">
              <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-slate-500">Submitting as: </span>
                <span className="font-semibold text-blue-900">{currentUser.name}</span>
                <span className="text-blue-700 font-normal"> ({currentUser.title})</span>
              </div>
            </div>
            <div className="flex items-center text-slate-500 space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today ({formatShortDate(new Date())})</span>
            </div>
          </div>

          {/* Candidate Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Candidate Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Anita Rao"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                formErrors.candidateName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {formErrors.candidateName && (
              <p className="text-xs text-rose-600 mt-1">{formErrors.candidateName}</p>
            )}
          </div>

          {/* Email & Phone grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="anita@example.com"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  formErrors.candidateEmail ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {formErrors.candidateEmail && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.candidateEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={candidatePhone}
                onChange={(e) => setCandidatePhone(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  formErrors.candidatePhone ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {formErrors.candidatePhone && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.candidatePhone}</p>
              )}
            </div>
          </div>

          {/* Requisition selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Requisition *
            </label>
            <select
              value={requisitionId}
              onChange={(e) => handleRequisitionChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {requisitions.map((req) => (
                <option key={req.requisition_id} value={req.requisition_id}>
                  {req.code} - {req.title}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-populated Client */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Client (Auto-Populated)
            </label>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-100/70 text-sm text-slate-800 font-medium">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>{selectedClientName || 'No Client Selected'}</span>
            </div>
          </div>

          {/* Additional details (Skills / Location) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Primary Skill</label>
              <input
                type="text"
                placeholder="e.g. Node.js, React"
                value={candidateSkill}
                onChange={(e) => setCandidateSkill(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                value={candidateLocation}
                onChange={(e) => setCandidateLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
            >
              <span>Save Submission</span>
            </button>
          </div>
        </form>
      </div>

      {/* Duplicate Warning Dialogs Overlay */}
      {duplicateCheck && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Scenario A: WARNING_REASON_REQUIRED */}
            {duplicateCheck.type === 'WARNING_REASON_REQUIRED' && (
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-full bg-amber-100 text-amber-600 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Possible Duplicate Submission</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-900">{candidateName}</span> has already been submitted to this requisition.
                    </p>
                  </div>
                </div>

                {/* Existing Submission Info Card */}
                <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs text-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Submitted by:</span>
                    <span className="font-semibold">{duplicateCheck.existingSubmission.submitter.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Submitted:</span>
                    <span>{formatDate(duplicateCheck.existingSubmission.submitted_at, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Current status:</span>
                    <StatusBadge status={duplicateCheck.existingSubmission.status} size="sm" />
                  </div>
                </div>

                {/* Reason Selection */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-900">
                    Why are you resubmitting?
                  </label>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center space-x-2.5 p-2 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="dupReason"
                        value="Different role"
                        checked={duplicateReasonCategory === 'Different role'}
                        onChange={() => setDuplicateReasonCategory('Different role')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-800 font-medium">Different role</span>
                    </label>

                    <label className="flex items-center space-x-2.5 p-2 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="dupReason"
                        value="Circumstances changed after rejection"
                        checked={duplicateReasonCategory === 'Circumstances changed after rejection'}
                        onChange={() => setDuplicateReasonCategory('Circumstances changed after rejection')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-800 font-medium">Circumstances changed after rejection</span>
                    </label>

                    <label className="flex items-center space-x-2.5 p-2 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="dupReason"
                        value="Other"
                        checked={duplicateReasonCategory === 'Other'}
                        onChange={() => setDuplicateReasonCategory('Other')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-800 font-medium">Other</span>
                    </label>

                    {duplicateReasonCategory === 'Other' && (
                      <div className="pt-1">
                        <textarea
                          placeholder="Explain why resubmission is required..."
                          value={otherReasonText}
                          onChange={(e) => setOtherReasonText(e.target.value)}
                          rows={2}
                          className="w-full p-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500/20"
                        />
                        {formErrors.otherReason && (
                          <p className="text-xs text-rose-600">{formErrors.otherReason}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning Footer Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDuplicateCheck(null)}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDuplicateSave}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm"
                  >
                    Continue with submission
                  </button>
                </div>
              </div>
            )}

            {/* Scenario B: OLD_REJECTED_WITHDRAWN (>90 Days Rule) */}
            {duplicateCheck.type === 'OLD_REJECTED_WITHDRAWN' && (
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-full bg-blue-100 text-blue-600 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Historical Resubmission Allowed</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-900">{candidateName}</span> was previously {duplicateCheck.existingSubmission.status.toLowerCase()} on this requisition {duplicateCheck.daysAgo} days ago (more than 90 days).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                  This is considered a low-risk resubmission. No duplicate reason is required.
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDuplicateCheck(null)}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => executeSubmissionSave(false, null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    Proceed with Submission
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
