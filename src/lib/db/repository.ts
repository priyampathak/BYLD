import {
  User,
  Candidate,
  Client,
  Requisition,
  Submission,
  SubmissionWithDetails,
  SubmissionStatus,
  DuplicateCheckResult,
} from '../types';
import {
  SEED_USERS,
  SEED_CLIENTS,
  SEED_REQUISITIONS,
  SEED_CANDIDATES,
  SEED_SUBMISSIONS,
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'byld_users_v1',
  CLIENTS: 'byld_clients_v1',
  REQUISITIONS: 'byld_requisitions_v1',
  CANDIDATES: 'byld_candidates_v1',
  SUBMISSIONS: 'byld_submissions_v1',
};

class MockRepository {
  private users: User[] = [];
  private clients: Client[] = [];
  private requisitions: Requisition[] = [];
  private candidates: Candidate[] = [];
  private submissions: Submission[] = [];
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      // SSR fallback to seed data
      this.users = [...SEED_USERS];
      this.clients = [...SEED_CLIENTS];
      this.requisitions = [...SEED_REQUISITIONS];
      this.candidates = [...SEED_CANDIDATES];
      this.submissions = [...SEED_SUBMISSIONS];
      return;
    }

    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      const storedReqs = localStorage.getItem(STORAGE_KEYS.REQUISITIONS);
      const storedCands = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      const storedSubs = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);

      this.users = storedUsers ? JSON.parse(storedUsers) : [...SEED_USERS];
      this.clients = storedClients ? JSON.parse(storedClients) : [...SEED_CLIENTS];
      this.requisitions = storedReqs ? JSON.parse(storedReqs) : [...SEED_REQUISITIONS];
      this.candidates = storedCands ? JSON.parse(storedCands) : [...SEED_CANDIDATES];
      this.submissions = storedSubs ? JSON.parse(storedSubs) : [...SEED_SUBMISSIONS];

      if (!storedUsers) this.persist(STORAGE_KEYS.USERS, this.users);
      if (!storedClients) this.persist(STORAGE_KEYS.CLIENTS, this.clients);
      if (!storedReqs) this.persist(STORAGE_KEYS.REQUISITIONS, this.requisitions);
      if (!storedCands) this.persist(STORAGE_KEYS.CANDIDATES, this.candidates);
      if (!storedSubs) this.persist(STORAGE_KEYS.SUBMISSIONS, this.submissions);

      this.initialized = true;
    } catch {
      this.users = [...SEED_USERS];
      this.clients = [...SEED_CLIENTS];
      this.requisitions = [...SEED_REQUISITIONS];
      this.candidates = [...SEED_CANDIDATES];
      this.submissions = [...SEED_SUBMISSIONS];
    }
  }

  private persist(key: string, data: unknown) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('LocalStorage error:', e);
      }
    }
  }

  public resetToSeedData() {
    this.users = [...SEED_USERS];
    this.clients = [...SEED_CLIENTS];
    this.requisitions = [...SEED_REQUISITIONS];
    this.candidates = [...SEED_CANDIDATES];
    this.submissions = [...SEED_SUBMISSIONS];

    this.persist(STORAGE_KEYS.USERS, this.users);
    this.persist(STORAGE_KEYS.CLIENTS, this.clients);
    this.persist(STORAGE_KEYS.REQUISITIONS, this.requisitions);
    this.persist(STORAGE_KEYS.CANDIDATES, this.candidates);
    this.persist(STORAGE_KEYS.SUBMISSIONS, this.submissions);
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  // --- Clients ---
  public getClients(): Client[] {
    return this.clients;
  }

  public getClientById(id: string): Client | undefined {
    return this.clients.find((c) => c.client_id === id);
  }

  public createClient(name: string, industry?: string, contact_email?: string): Client {
    const newClient: Client = {
      client_id: `client_${Date.now()}`,
      name,
      industry,
      contact_email,
    };
    this.clients.unshift(newClient);
    this.persist(STORAGE_KEYS.CLIENTS, this.clients);
    return newClient;
  }

  // --- Requisitions ---
  public getRequisitions(): Requisition[] {
    return this.requisitions;
  }

  public getRequisitionById(id: string): Requisition | undefined {
    return this.requisitions.find((r) => r.requisition_id === id);
  }

  public createRequisition(
    title: string,
    client_id: string,
    code?: string,
    department?: string,
    location?: string
  ): Requisition {
    const reqCode = code || `REQ-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: Requisition = {
      requisition_id: `req_${Date.now()}`,
      code: reqCode,
      title,
      client_id,
      status: 'Active',
      department,
      location,
    };
    this.requisitions.unshift(newReq);
    this.persist(STORAGE_KEYS.REQUISITIONS, this.requisitions);
    return newReq;
  }

  // --- Candidates ---
  public getCandidates(): Candidate[] {
    return this.candidates;
  }

  public getCandidateById(id: string): Candidate | undefined {
    return this.candidates.find((c) => c.candidate_id === id);
  }

  public findCandidateByContact(email: string, phone: string): Candidate | undefined {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    return this.candidates.find((c) => {
      const matchEmail = c.email.trim().toLowerCase() === cleanEmail;
      const matchPhone = c.phone.trim().replace(/\s+/g, '') === cleanPhone;
      return matchEmail || matchPhone;
    });
  }

  public createCandidate(name: string, email: string, phone: string, location?: string, primary_skill?: string): Candidate {
    const existing = this.findCandidateByContact(email, phone);
    if (existing) return existing;

    const newCandidate: Candidate = {
      candidate_id: `cand_${Date.now()}`,
      name,
      email,
      phone,
      location,
      primary_skill,
    };
    this.candidates.unshift(newCandidate);
    this.persist(STORAGE_KEYS.CANDIDATES, this.candidates);
    return newCandidate;
  }

  // --- Submissions ---
  public getSubmissions(): SubmissionWithDetails[] {
    return this.submissions.map((sub) => this.enrichSubmission(sub));
  }

  public getSubmissionById(id: string): SubmissionWithDetails | undefined {
    const sub = this.submissions.find((s) => s.submission_id === id);
    if (!sub) return undefined;
    return this.enrichSubmission(sub);
  }

  private enrichSubmission(sub: Submission): SubmissionWithDetails {
    const candidate = this.candidates.find((c) => c.candidate_id === sub.candidate_id) || {
      candidate_id: sub.candidate_id,
      name: 'Unknown Candidate',
      email: '',
      phone: '',
    };

    const requisition = this.requisitions.find((r) => r.requisition_id === sub.requisition_id) || {
      requisition_id: sub.requisition_id,
      code: 'REQ-000',
      title: 'Unknown Requisition',
      client_id: '',
      status: 'Active' as const,
    };

    const client = this.clients.find((cl) => cl.client_id === requisition.client_id) || {
      client_id: requisition.client_id || '',
      name: 'Unknown Client',
    };

    const submitter = this.users.find((u) => u.id === sub.submitted_by) || {
      id: sub.submitted_by,
      name: 'Unknown User',
      email: '',
      role: 'account_manager' as const,
      avatar: '',
      title: 'Account Manager',
    };

    return {
      ...sub,
      candidate,
      requisition,
      client,
      submitter,
    };
  }

  // Duplicate Check logic according to Sections 13, 14, 15 of PRD
  public checkDuplicate(
    candidateEmail: string,
    candidatePhone: string,
    requisitionId: string
  ): DuplicateCheckResult {
    const candidate = this.findCandidateByContact(candidateEmail, candidatePhone);
    if (!candidate) {
      return { type: 'NONE' };
    }

    // Find all previous submissions for this candidate + requisition
    const matchingSubs = this.submissions
      .filter((s) => s.candidate_id === candidate.candidate_id && s.requisition_id === requisitionId)
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

    if (matchingSubs.length === 0) {
      return { type: 'NONE' };
    }

    const latestMatchingSub = this.enrichSubmission(matchingSubs[0]);
    const subDate = new Date(latestMatchingSub.submitted_at);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - subDate.getTime()) / (1000 * 60 * 60 * 24));

    const activeStatuses: SubmissionStatus[] = ['Submitted', 'Client Review', 'Interview', 'Offer'];
    const isCurrentlyActive = activeStatuses.includes(latestMatchingSub.status);

    if (isCurrentlyActive) {
      return {
        type: 'WARNING_REASON_REQUIRED',
        existingSubmission: latestMatchingSub,
        message: `${latestMatchingSub.candidate.name} has an active submission on this requisition (Status: ${latestMatchingSub.status}, Submitted by ${latestMatchingSub.submitter.name}).`,
      };
    }

    // Inactive status (Rejected or Withdrawn)
    if (daysAgo >= 90) {
      return {
        type: 'OLD_REJECTED_WITHDRAWN',
        existingSubmission: latestMatchingSub,
        daysAgo,
        message: `${latestMatchingSub.candidate.name} was previously ${latestMatchingSub.status.toLowerCase()} on this requisition ${daysAgo} days ago (more than 90 days). You may resubmit.`,
      };
    } else {
      return {
        type: 'WARNING_REASON_REQUIRED',
        existingSubmission: latestMatchingSub,
        message: `${latestMatchingSub.candidate.name} was ${latestMatchingSub.status.toLowerCase()} on this requisition ${daysAgo} days ago (less than 90 days ago).`,
      };
    }
  }

  public createSubmission(params: {
    candidateName: string;
    candidateEmail: string;
    candidatePhone: string;
    candidateLocation?: string;
    candidateSkill?: string;
    requisitionId: string;
    submittedByUserId: string;
    duplicateReason?: string | null;
    isDuplicateConfirmed?: boolean;
  }): { submission: SubmissionWithDetails; warning?: DuplicateCheckResult } {
    const {
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateLocation,
      candidateSkill,
      requisitionId,
      submittedByUserId,
      duplicateReason,
    } = params;

    // 1. Find or create candidate
    const candidate = this.createCandidate(
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateLocation,
      candidateSkill
    );

    // 2. Perform duplicate check
    const dupCheck = this.checkDuplicate(candidateEmail, candidatePhone, requisitionId);

    let isDuplicateFlag = false;
    let finalReason: string | null = null;
    let originalSubId: string | null = null;

    if (dupCheck.type === 'WARNING_REASON_REQUIRED') {
      isDuplicateFlag = true;
      finalReason = duplicateReason || 'Duplicate overridden by AM';
      originalSubId = dupCheck.existingSubmission.submission_id;
    } else if (dupCheck.type === 'OLD_REJECTED_WITHDRAWN') {
      // Section 15: Low risk resubmission, do NOT force duplicate reason
      isDuplicateFlag = false;
      finalReason = null;
      originalSubId = dupCheck.existingSubmission.submission_id;
    }

    const submitter = this.getUserById(submittedByUserId);
    const submitterName = submitter ? submitter.name : 'Unknown User';

    const newSub: Submission = {
      submission_id: `sub_${Date.now()}`,
      candidate_id: candidate.candidate_id,
      requisition_id: requisitionId,
      submitted_by: submittedByUserId,
      submitted_at: new Date().toISOString(),
      status: 'Submitted',
      status_history: [
        {
          status: 'Submitted',
          changed_by: submittedByUserId,
          changed_by_name: submitterName,
          changed_at: new Date().toISOString(),
          note: isDuplicateFlag ? `Flagged duplicate resubmission (Reason: ${finalReason})` : undefined,
        },
      ],
      duplicate_flag: isDuplicateFlag,
      duplicate_reason: finalReason,
      duplicate_override_by: isDuplicateFlag ? submittedByUserId : null,
      duplicate_override_at: isDuplicateFlag ? new Date().toISOString() : null,
      original_submission_id: originalSubId,
    };

    this.submissions.unshift(newSub);
    this.persist(STORAGE_KEYS.SUBMISSIONS, this.submissions);

    return {
      submission: this.enrichSubmission(newSub),
      warning: dupCheck.type !== 'NONE' ? dupCheck : undefined,
    };
  }

  public updateStatus(
    submissionId: string,
    newStatus: SubmissionStatus,
    userId: string,
    note?: string
  ): SubmissionWithDetails {
    const sub = this.submissions.find((s) => s.submission_id === submissionId);
    if (!sub) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const user = this.getUserById(userId);
    const userName = user ? user.name : 'Unknown User';

    sub.status = newStatus;
    sub.status_history.unshift({
      status: newStatus,
      changed_by: userId,
      changed_by_name: userName,
      changed_at: new Date().toISOString(),
      note,
    });

    this.persist(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    return this.enrichSubmission(sub);
  }
}

export const repository = new MockRepository();
