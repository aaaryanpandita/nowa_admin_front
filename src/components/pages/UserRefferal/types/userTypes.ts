// types/userTypes.ts - Updated with proper referral pagination support
export interface User {
  id: number;
  walletAddress: string;
  socialTasksCompleted: boolean;
  referralTasksCompleted: boolean;
  hasCompletedBoth: boolean;
  rewardEarned: number;
  rewardStatus: string;
  referrals?: User[];
  referralCount?: number;

  xusername?: string;
  instagramusername?: string;
  telegramusername?: string;
  createdAt?: string;

  // New: Referral pagination data from API
  referredUsersPagination?: {
    totalReferred: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface UserManagementData {
  users: User[];
  totalUsers: number;
  totalGlobalReward: number;
}

export interface ApiResponse {
  success: boolean;
  data?: {
    result: {
      totalUsers: number;
      totalGlobalReward: number;
      users?: User[];
    };
  };
  message?: string;
}

export interface UserRowProps {
  user: User;
  onToggleExpand: (userId: number) => void;
  isExpanded: boolean;
  referralsPerPage?: number;
  currentRefPage?: number;
  onRefPageChange?: (userId: number, page: number) => void;
  totalReferralPages?: number;
  isLoadingReferrals?: boolean;
}



// New interface for referral pagination state management
export interface ReferralPaginationState {
  totalReferred: number;
  currentPage: number;
  totalPages: number;
}

// Enhanced interface for API responses with proper pagination
export interface UserApiResponse {
  id: number;
  walletAddress: string;
  socialTasksCompleted: boolean;
  referralTasksCompleted: boolean;
  hasCompletedBoth: boolean;
  rewardEarned: number;
  rewardStatus: string;
  referredUsers?: UserApiResponse[];
  referredUsersPagination?: {
    totalReferred: number;
    currentPage: number;
    totalPages: number;
  };
}