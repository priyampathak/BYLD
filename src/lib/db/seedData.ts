import { User, Candidate, Client, Requisition, Submission } from '../types';

const now = new Date();
const getIsoDaysAgo = (days: number, hoursOffset = 0): string => {
  const d = new Date(now.getTime() - days * 24 * 60 * 60 * 1000 - hoursOffset * 60 * 60 * 1000);
  return d.toISOString();
};

export const SEED_USERS: User[] = [
  {
    id: 'user_am_1',
    name: 'Priya Pathak',
    email: 'priya@byld.demo',
    role: 'account_manager',
    title: 'Senior Account Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_am_2',
    name: 'Raj Mehta',
    email: 'raj@byld.demo',
    role: 'account_manager',
    title: 'Account Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_am_3',
    name: 'Amit Verma',
    email: 'amit@byld.demo',
    role: 'account_manager',
    title: 'Account Manager - Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_ops_1',
    name: 'Sarah Jenkins',
    email: 'ops@byld.demo',
    role: 'ops_delivery',
    title: 'Delivery & Ops Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_sales_1',
    name: 'Vikram Malhotra',
    email: 'sales@byld.demo',
    role: 'sales_leadership',
    title: 'VP of Client Partnerships',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
];

export const SEED_CLIENTS: Client[] = [
  { client_id: 'client_1', name: 'Acme Corp', industry: 'Enterprise SaaS', contact_email: 'hiring@acme.com' },
  { client_id: 'client_2', name: 'HDFC Tech', industry: 'Fintech & Banking', contact_email: 'talent@hdfctech.com' },
  { client_id: 'client_3', name: 'Zomato Operations', industry: 'Logistics & Consumer Tech', contact_email: 'careers@zomato.com' },
  { client_id: 'client_4', name: 'Infosys Innovation', industry: 'IT Services', contact_email: 'recruiting@infosys.com' },
  { client_id: 'client_5', name: 'Razorpay', industry: 'Payments & Financial Infrastructure', contact_email: 'tech-hiring@razorpay.com' },
];

export const SEED_REQUISITIONS: Requisition[] = [
  { requisition_id: 'req_1', code: 'REQ-204', title: 'Senior Backend Engineer', client_id: 'client_1', status: 'Active', department: 'Engineering', location: 'Bengaluru / Remote' },
  { requisition_id: 'req_2', code: 'REQ-205', title: 'Staff Frontend Architect', client_id: 'client_1', status: 'Active', department: 'Engineering', location: 'Bengaluru' },
  { requisition_id: 'req_3', code: 'REQ-102', title: 'Fullstack Node/React Lead', client_id: 'client_2', status: 'Active', department: 'Digital Transformation', location: 'Mumbai' },
  { requisition_id: 'req_4', code: 'REQ-108', title: 'Cloud DevOps Architect', client_id: 'client_2', status: 'Active', department: 'Infrastructure', location: 'Mumbai / Pune' },
  { requisition_id: 'req_5', code: 'REQ-301', title: 'Engineering Manager - Logistics', client_id: 'client_3', status: 'Active', department: 'Core Logistics', location: 'Gurugram' },
  { requisition_id: 'req_6', code: 'REQ-409', title: 'Principal Data Scientist', client_id: 'client_4', status: 'Active', department: 'AI & Data Lab', location: 'Hyderabad' },
  { requisition_id: 'req_7', code: 'REQ-502', title: 'Senior Security Engineer', client_id: 'client_5', status: 'Active', department: 'InfoSec', location: 'Bengaluru' },
];

export const SEED_CANDIDATES: Candidate[] = [
  { candidate_id: 'cand_1', name: 'Anita Rao', email: 'anita.rao@example.com', phone: '+91 98765 43210', location: 'Bengaluru', primary_skill: 'Go, Java, Distributed Systems' },
  { candidate_id: 'cand_2', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', phone: '+91 98123 45678', location: 'Mumbai', primary_skill: 'Node.js, React, GraphQL' },
  { candidate_id: 'cand_3', name: 'Ananya Roy', email: 'ananya.roy@example.com', phone: '+91 97111 22334', location: 'Gurugram', primary_skill: 'Engineering Management, Python' },
  { candidate_id: 'cand_4', name: 'Karthik Iyer', email: 'karthik.iyer@example.com', phone: '+91 99887 76655', location: 'Chennai', primary_skill: 'AWS, Kubernetes, Terraform' },
  { candidate_id: 'cand_5', name: 'Pooja Nair', email: 'pooja.nair@example.com', phone: '+91 98450 12345', location: 'Bengaluru', primary_skill: 'React, TypeScript, Next.js' },
  { candidate_id: 'cand_6', name: 'Vikram Singhania', email: 'vikram.s@example.com', phone: '+91 98990 88776', location: 'Delhi NCR', primary_skill: 'PyTorch, MLOps, Data Pipelines' },
  { candidate_id: 'cand_7', name: 'Siddharth Patel', email: 'siddharth.p@example.com', phone: '+91 97234 56789', location: 'Ahmedabad', primary_skill: 'Cybersecurity, PenTesting, Go' },
  { candidate_id: 'cand_8', name: 'Meera Deshmukh', email: 'meera.d@example.com', phone: '+91 98333 44556', location: 'Pune', primary_skill: 'Java Spring Boot, Microservices' },
  { candidate_id: 'cand_9', name: 'Arjun Kapoor', email: 'arjun.k@example.com', phone: '+91 99100 22446', location: 'Bengaluru', primary_skill: 'System Architecture, C++' },
  { candidate_id: 'cand_10', name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 97654 32109', location: 'Hyderabad', primary_skill: 'Spark, Snowflake, ETL' },
];

export const SEED_SUBMISSIONS: Submission[] = [
  // 1. Normal submission - Active - Client Review
  {
    submission_id: 'sub_1',
    candidate_id: 'cand_1',
    requisition_id: 'req_1', // REQ-204 Acme Senior Backend
    submitted_by: 'user_am_1', // Priya Pathak
    submitted_at: getIsoDaysAgo(2, 4),
    status: 'Client Review',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(2, 4) },
      { status: 'Client Review', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(1, 2) },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // 2. Legitimate Flagged Duplicate - Resubmission by Raj Mehta for Anita Rao on REQ-204 with reason
  {
    submission_id: 'sub_2',
    candidate_id: 'cand_1',
    requisition_id: 'req_1', // REQ-204
    submitted_by: 'user_am_2', // Raj Mehta
    submitted_at: getIsoDaysAgo(1, 1),
    status: 'Submitted',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_2', changed_by_name: 'Raj Mehta', changed_at: getIsoDaysAgo(1, 1), note: 'Resubmitted after clarifying team role fit' },
    ],
    duplicate_flag: true,
    duplicate_reason: 'Different role scope discussed with client hiring manager',
    duplicate_override_by: 'user_am_2',
    duplicate_override_at: getIsoDaysAgo(1, 1),
    original_submission_id: 'sub_1',
  },

  // 3. Old Rejection (>90 days) scenario - Rohan Sharma rejected on REQ-102 HDFC Tech
  {
    submission_id: 'sub_3',
    candidate_id: 'cand_2',
    requisition_id: 'req_3', // REQ-102
    submitted_by: 'user_am_3', // Amit Verma
    submitted_at: getIsoDaysAgo(115),
    status: 'Rejected',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_3', changed_by_name: 'Amit Verma', changed_at: getIsoDaysAgo(115) },
      { status: 'Client Review', changed_by: 'user_am_3', changed_by_name: 'Amit Verma', changed_at: getIsoDaysAgo(112) },
      { status: 'Rejected', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(105), note: 'Budget mismatch at the time' },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // 4. Old Withdrawal (>90 days) scenario - Ananya Roy withdrawn on REQ-301 Zomato
  {
    submission_id: 'sub_4',
    candidate_id: 'cand_3',
    requisition_id: 'req_5', // REQ-301
    submitted_by: 'user_am_1', // Priya Pathak
    submitted_at: getIsoDaysAgo(100),
    status: 'Withdrawn',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(100) },
      { status: 'Withdrawn', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(96), note: 'Candidate accepted internal counteroffer' },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // 5. Active Interview - Pooja Nair on REQ-205 Acme Frontend Architect
  {
    submission_id: 'sub_5',
    candidate_id: 'cand_5',
    requisition_id: 'req_2', // REQ-205
    submitted_by: 'user_am_1', // Priya Pathak
    submitted_at: getIsoDaysAgo(5),
    status: 'Interview',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(5) },
      { status: 'Client Review', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(4) },
      { status: 'Interview', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(2), note: 'Round 1 technical scheduled' },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // 6. Active Offer - Karthik Iyer on REQ-4 Cloud DevOps HDFC
  {
    submission_id: 'sub_6',
    candidate_id: 'cand_4',
    requisition_id: 'req_4', // REQ-108
    submitted_by: 'user_am_2', // Raj Mehta
    submitted_at: getIsoDaysAgo(14),
    status: 'Offer',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_2', changed_by_name: 'Raj Mehta', changed_at: getIsoDaysAgo(14) },
      { status: 'Client Review', changed_by: 'user_am_2', changed_by_name: 'Raj Mehta', changed_at: getIsoDaysAgo(12) },
      { status: 'Interview', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(8) },
      { status: 'Offer', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(3), note: 'Offer released by client HR' },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // 7. Placed - Meera Deshmukh on REQ-301 Zomato EM
  {
    submission_id: 'sub_7',
    candidate_id: 'cand_8',
    requisition_id: 'req_5', // REQ-301
    submitted_by: 'user_am_3', // Amit Verma
    submitted_at: getIsoDaysAgo(25),
    status: 'Placed',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_3', changed_by_name: 'Amit Verma', changed_at: getIsoDaysAgo(25) },
      { status: 'Interview', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(18) },
      { status: 'Offer', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(10) },
      { status: 'Placed', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(4), note: 'Joined on Sep 5th' },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // 8. Flagged Duplicate #2 - Vikram Singhania on REQ-409 Infosys Data Scientist
  {
    submission_id: 'sub_8',
    candidate_id: 'cand_6',
    requisition_id: 'req_6', // REQ-409
    submitted_by: 'user_am_1', // Priya Pathak
    submitted_at: getIsoDaysAgo(10),
    status: 'Client Review',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(10) },
      { status: 'Client Review', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(7) },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },
  {
    submission_id: 'sub_9',
    candidate_id: 'cand_6',
    requisition_id: 'req_6', // REQ-409 Infosys Data Scientist
    submitted_by: 'user_am_3', // Amit Verma
    submitted_at: getIsoDaysAgo(6),
    status: 'Interview',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_3', changed_by_name: 'Amit Verma', changed_at: getIsoDaysAgo(6) },
      { status: 'Interview', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(3) },
    ],
    duplicate_flag: true,
    duplicate_reason: 'Circumstances changed after rejection',
    duplicate_override_by: 'user_am_3',
    duplicate_override_at: getIsoDaysAgo(6),
    original_submission_id: 'sub_8',
  },

  // 9. Siddharth Patel on REQ-502 Razorpay Security Engineer
  {
    submission_id: 'sub_10',
    candidate_id: 'cand_7',
    requisition_id: 'req_7', // REQ-502
    submitted_by: 'user_am_2', // Raj Mehta
    submitted_at: getIsoDaysAgo(3),
    status: 'Submitted',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_2', changed_by_name: 'Raj Mehta', changed_at: getIsoDaysAgo(3) },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // 10. Arjun Kapoor on REQ-204 Acme Senior Backend
  {
    submission_id: 'sub_11',
    candidate_id: 'cand_9',
    requisition_id: 'req_1',
    submitted_by: 'user_am_1', // Priya Pathak
    submitted_at: getIsoDaysAgo(1),
    status: 'Submitted',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(1) },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // 11. Neha Gupta on REQ-409 Infosys Data Scientist
  {
    submission_id: 'sub_12',
    candidate_id: 'cand_10',
    requisition_id: 'req_6',
    submitted_by: 'user_am_3', // Amit Verma
    submitted_at: getIsoDaysAgo(8),
    status: 'Rejected',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_3', changed_by_name: 'Amit Verma', changed_at: getIsoDaysAgo(8) },
      { status: 'Rejected', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(5), note: 'Lacks required Snowflake depth' },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },

  // Additional submissions to reach ~18-25 total realistic submissions across all statuses
  {
    submission_id: 'sub_13',
    candidate_id: 'cand_2', // Rohan Sharma
    requisition_id: 'req_1', // REQ-204
    submitted_by: 'user_am_2',
    submitted_at: getIsoDaysAgo(4),
    status: 'Client Review',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_2', changed_by_name: 'Raj Mehta', changed_at: getIsoDaysAgo(4) },
      { status: 'Client Review', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(3) },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },
  {
    submission_id: 'sub_14',
    candidate_id: 'cand_3', // Ananya Roy
    requisition_id: 'req_2', // REQ-205
    submitted_by: 'user_am_1',
    submitted_at: getIsoDaysAgo(7),
    status: 'Interview',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(7) },
      { status: 'Interview', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(4) },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },
  {
    submission_id: 'sub_15',
    candidate_id: 'cand_5', // Pooja Nair
    requisition_id: 'req_3', // REQ-102
    submitted_by: 'user_am_3',
    submitted_at: getIsoDaysAgo(12),
    status: 'Placed',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_3', changed_by_name: 'Amit Verma', changed_at: getIsoDaysAgo(12) },
      { status: 'Placed', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(2) },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },
  {
    submission_id: 'sub_16',
    candidate_id: 'cand_8', // Meera Deshmukh
    requisition_id: 'req_7', // REQ-502
    submitted_by: 'user_am_2',
    submitted_at: getIsoDaysAgo(9),
    status: 'Client Review',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_2', changed_by_name: 'Raj Mehta', changed_at: getIsoDaysAgo(9) },
      { status: 'Client Review', changed_by: 'user_ops_1', changed_by_name: 'Sarah Jenkins', changed_at: getIsoDaysAgo(6) },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },
  {
    submission_id: 'sub_17',
    candidate_id: 'cand_10', // Neha Gupta
    requisition_id: 'req_4', // REQ-108
    submitted_by: 'user_am_1',
    submitted_at: getIsoDaysAgo(15),
    status: 'Withdrawn',
    status_history: [
      { status: 'Submitted', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(15) },
      { status: 'Withdrawn', changed_by: 'user_am_1', changed_by_name: 'Priya Pathak', changed_at: getIsoDaysAgo(11), note: 'Candidate relocation preference changed' },
    ],
    duplicate_flag: false,
    duplicate_reason: null,
  },
];
