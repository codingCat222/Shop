export type UserRole = 'buyer' | 'seller' | 'admin';

export type VerificationStatus = 'GUEST' | 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface UserProfile {
  id: string;
  tempId: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  bankName?: string;
  accountNumber?: string;
  walletBalance: number;
  isPro: boolean;
  avatarColor: string;
  phoneNumber?: string;
  profilePicture?: string;
  totalTrades?: number;
  completionRate?: string;
  completedTrades?: number;
  tier?: number;
  deliveryAddress?: string;
  documents?: {
    bvn?: string;
    idCardName?: string;
    submittedAt?: string;
  };
  auditLogs?: AuditLog[];
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}
