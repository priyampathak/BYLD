export type UserRole = 'account_manager' | 'ops_delivery' | 'sales_leadership' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
}

export interface Candidate {
  candidate_id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  primary_skill?: string;
}

export interface Client {
  client_id: string;
  name: string;
  industry?: string;
  contact_email?: string;
}

export interface Requisition {
  requisition_id: string;
  code: string; // e.g. REQ-204
  title: string;
  client_id: string;
  status: 'Active' | 'Closed' | 'Draft';
  department?: string;
  location?: string;
}

export type SubmissionStatus = 
  | 'Submitted'
  | 'Client Review'
  | 'Interview'
  | 'Offer'
  | 'Placed'
  | 'Rejected'
  | 'Withdrawn';

export interface StatusHistory {
  status: SubmissionStatus;
  changed_by: string; // user id
  changed_by_name: string;
  changed_at: string; // ISO string
  note?: string;
}

export interface Submission {
  submission_id: string;
  candidate_id: string;
  requisition_id: string;
  submitted_by: string; // user id
  submitted_at: string; // ISO string
  status: SubmissionStatus;
  status_history: StatusHistory[];
  duplicate_flag: boolean;
  duplicate_reason: string | null;
  duplicate_override_by?: string | null;
  duplicate_override_at?: string | null;
  original_submission_id?: string | null;
}

export interface SubmissionWithDetails extends Submission {
  candidate: Candidate;
  requisition: Requisition;
  client: Client;
  submitter: User;
}

export type DuplicateCheckResult = 
  | { type: 'NONE' }
  | { 
      type: 'SILENT_ACTIVE_BLOCK'; 
      existingSubmission: SubmissionWithDetails; 
      message: string;
    }
  | { 
      type: 'OLD_REJECTED_WITHDRAWN'; 
      existingSubmission: SubmissionWithDetails; 
      daysAgo: number; 
      message: string;
    }
  | { 
      type: 'WARNING_REASON_REQUIRED'; 
      existingSubmission: SubmissionWithDetails; 
      message: string;
    };
