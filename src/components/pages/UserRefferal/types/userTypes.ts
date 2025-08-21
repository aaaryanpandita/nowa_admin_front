// types/userTypes.ts
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