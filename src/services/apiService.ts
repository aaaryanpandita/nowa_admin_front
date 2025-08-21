// services/apiService.ts
const API_BASE_URL = 'http://172.16.16.206:8083/api/v1';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface DashboardData {
  result: {
    totalUsers: number;
    totalGlobalReward: number;
    users:string;
    referredUsers: string;
    
  };
}

interface ReferralRewardData {
  referralReward: number;
}

interface ReferralRewardResponse {
  success: boolean;
  message?: string;
  result?: any;
}

// New interface for referral reward
interface ReferralReward {
  id: number;
  refferedreward: number;
  createdAt: string;
  updatedAt: string;
}

interface GetReferralRewardResponse {
  success: boolean;
  message?: string;
  result?: ReferralReward[];
}

// New interfaces for task management
interface DailyTask {
  id?: string;
  title: string;
  description: string;
  link: string;
  // Properties used when creating tasks (POST)
  taskDate?: string;     
  startTime?: string;    
  endTime?: string;      
  // Properties returned by API (GET)
  createdAt?: string;    
  updatedAt?: string;    
}

interface CreateTaskPayload {
  tasks: DailyTask[];
}

interface TasksResponse {
  success: boolean;
  message?: string;
  result?: {
    tasks: DailyTask[];  // Corrected: result contains the tasks array
    totalTasks: number;  // Total number of tasks, if needed
  };
}
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class ApiService {
  private static instance: ApiService;
  
  private constructor() {}
  
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Helper method to get authenticated headers
  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token available for authorization');
    }

    return headers;
  }

  // Helper method for authenticated requests
  private async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Check if user is authenticated before making the request
    if (!this.isAuthenticated()) {
      console.error('❌ User is not authenticated');
      throw new Error('User is not authenticated. Please login first.');
    }

    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Check if token is expired (401 Unauthorized)
    if (response.status === 401) {
      console.error('🔒 Token expired or invalid, logging out');
      this.logout();
      throw new Error('Session expired. Please login again.');
    }

    return response;
  }

  async loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/loginAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage if login is successful
      if (data.result.token) {
        const token = data.result.token;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
      } else {
        console.warn('⚠️ No token in login response');
      }

      return {
        success: true,
        ...data
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  async getAllUsersWithReferrals(): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/getAllUsersWithReferrals`
      );

      const data = await response.json();

      console.log("the data is",data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      const { totalUsers, totalGlobalReward, users,referredUsers } = data.result;
      
     console.log("the cou is",data.result.users)

      return {
        success: true,
        data: {
          result: {
            totalUsers,
            totalGlobalReward,
            referredUsers,
            users
          }
        }
      };
    } catch (error) {
      console.error('❌ Dashboard data fetch error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // New method to add referral reward
  async addReferralReward(refferedreward: number): Promise<ReferralRewardResponse> {
    try {
      console.log('🚀 Adding referral reward:', refferedreward);

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/addRefferalReward`,
        {
          method: 'POST',
           body: JSON.stringify({ refferedreward: refferedreward }),
        }
      );

      const data = await response.json();
      console.log('📤 Referral reward response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add referral reward');
      }

      return {
        success: true,
        message: data.message || 'Referral reward added successfully',
        result: data.result
      };
    } catch (error) {
      console.error('❌ Add referral reward error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // New method to get referral rewards (sorted by latest ID)
  async getReferralRewards(): Promise<GetReferralRewardResponse> {
    try {
      console.log('🔄 Fetching referral rewards...');

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/getRefferalRewards`
      );

      const data = await response.json();
      console.log('📋 Referral rewards response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch referral rewards');
      }

      // Sort by ID in descending order to get latest first
      const sortedRewards = data.result ? data.result.sort((a: ReferralReward, b: ReferralReward) => b.id - a.id) : [];

      return {
        success: true,
        result: sortedRewards,
        message: data.message
      };
    } catch (error) {
      console.error('❌ Get referral rewards error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Helper method to get the latest referral reward amount
  async getLatestReferralReward(): Promise<{ success: boolean; reward?: number; message?: string }> {
    try {
      const response = await this.getReferralRewards();
      
      if (response.success && response.result && response.result.length > 0) {
        // Return the latest reward (first item after sorting)
        const latestReward = response.result[0];
        console.log('💰 Latest referral reward:', latestReward.refferedreward);
        return {
          success: true,
          reward: latestReward.refferedreward
        };
      } else {
        console.warn('⚠️ No referral rewards found');
        return {
          success: false,
          message: 'No referral rewards found'
        };
      }
    } catch (error) {
      console.error('❌ Get latest referral reward error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Get all daily tasks
  async getDailyTasks(): Promise<TasksResponse> {
    try {
      console.log('🔄 Fetching daily tasks...');

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/getDailyTasks`
      );

      const data = await response.json();
      console.log('📋 Tasks response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch daily tasks');
      }

      return {
        success: true,
        result: data.result,
        message: data.message
      };
    } catch (error) {
      console.error('❌ Get daily tasks error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Add daily task(s)
  async addDailyTask(taskData: CreateTaskPayload): Promise<TasksResponse> {
    try {
      console.log('🚀 Adding daily task(s):', taskData);

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/addDailyTask`,
        {
          method: 'POST',
          body: JSON.stringify(taskData),
        }
      );

      const data = await response.json();
      console.log('📤 Add task response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add daily task');
      }

      return {
        success: true,
        message: data.message || 'Daily task added successfully',
        result: data.result
      };
    } catch (error) {
      console.error('❌ Add daily task error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear stored data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    const isAuth = !!token;
    return isAuth;
  }

  getAuthToken(): string | null {
    const token = localStorage.getItem('adminToken');
    return token;
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }
}

export const apiService = ApiService.getInstance();

// Export types for use in components
export type { DailyTask, CreateTaskPayload, TasksResponse, ReferralReward, GetReferralRewardResponse };