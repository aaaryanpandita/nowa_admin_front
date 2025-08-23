// services/apiService.ts - Enhanced with getReferredUsers method
const API_BASE_URL = 'https://nowa-ref-api.tarality.io/api/v1';
//const API_BASE_URL = 'http://localhost:8083/api/v1';

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
    totalReferralTokensEarned: number;
    users: any[];
    referredUsers?: string;
     totalReferred: number;
    totalPages?: number; // Add totalPages support
  };
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
  id?: string | number;
  title: string;
  description: string;
  link: string;
  taskDate?: string;     
  startTime?: string;    
  endTime?: string;      
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
    tasks: DailyTask[];
    totalTasks: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Enhanced interface for user referrals response (specific to getReferredUsers endpoint)
interface GetReferredUsersResponse {
  success: boolean;
  data?: {
    referrals: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReferrals: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  } | null;
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
        throw new Error(data.message || 'Invalid email or password');
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

  // Enhanced method to get all users (main page list) - simplified to not handle referrals
  async getAllUsers(page: number = 1): Promise<ApiResponse<DashboardData>> {
    try {
      const url = `${API_BASE_URL}/admin/getAllUsers?page=${page}`;
     
      
      const response = await this.authenticatedFetch(url);
      const data = await response.json();
      

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users data');
      }

      const { totalUsers, totalReferralTokensEarned, users, totalReferred } = data.result;
      

      return {
        success: true,
        data: {
          result: {
            totalUsers,
            totalReferralTokensEarned,
            totalReferred,
            users: users || [],
            totalPages: data.result.totalPages
          }
        }
      };
    } catch (error) {
      console.error('❌ Users data fetch error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // NEW METHOD: Get referrals for a specific user using dedicated endpoint
// Fixed getReferredUsers method in apiService.ts
async getReferredUsers(
  userAddress: string, 
  page: number = 1, 
  limit: number = 10
): Promise<GetReferredUsersResponse> {
  try {
    // Validate inputs
    if (!userAddress || userAddress.trim() === "") {
      console.error('❌ Invalid userAddress provided:', userAddress);
      return {
        success: false,
        data: null,
        message: 'Invalid user address provided'
      };
    }

    // CRITICAL FIX: Ensure we're using the FULL address without any truncation
    const fullAddress = userAddress.trim();

  

    if (!page || isNaN(page) || page <= 0) {
      console.error('❌ Invalid page provided:', page);
      page = 1; // Default to page 1
    }

   
    
    // Use dedicated endpoint for getting user referrals - ENCODE THE ADDRESS PROPERLY
    const encodedAddress = encodeURIComponent(fullAddress);
    const url = `${API_BASE_URL}/admin/getReferredUsers/${encodedAddress}?page=${page}&limit=${limit}`;
   
    
    const response = await this.authenticatedFetch(url);
    const data = await response.json();
    
    
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user referrals');
    }

    // Extract referral data from dedicated endpoint response
    let referrals: any[] = [];
    let pagination = {
      currentPage: page,
      totalPages: 0,
      totalReferrals: 0,
      hasNextPage: false,
      hasPrevPage: false
    };



    if (data.responseCode == 200 && data.result) {
      referrals = Array.isArray(data.result.referredUsers) ? data.result.referredUsers : [];
      
      // FIXED: Use API pagination data directly instead of overriding it
      pagination = {
        currentPage: data.result.currentPage || page,
        totalPages: data.result.totalPages || 0,
        totalReferrals: data.result.totalReferred || 0,
        hasNextPage: (data.result.currentPage || page) < (data.result.totalPages || 0),
        hasPrevPage: (data.result.currentPage || page) > 1
      };

      // console.log(`✅ User ${fullAddress} referrals found:`, {
      //   referralsCount: referrals.length,
      //   ...pagination
      // });
    } else {
      console.warn(`⚠️ No referral data found for user ${fullAddress}`);
      
      // Check if the API response indicates the user was not found
      if (data.message && (
        data.message.toLowerCase().includes('not found') ||
        data.message.toLowerCase().includes('no referrals') ||
        data.responseCode === 404
      )) {
        console.log(`📝 User ${fullAddress} has no referrals or was not found in the system`);
      }
    }

    return {
      success: true,
      data: {
        referrals,
        pagination
      },
      message: data.message
    };
  } catch (error) {
    console.error('❌ Get user referrals error:', error);
    
    // Additional error logging for debugging
    if (error instanceof Error) {
      console.error('❌ Error details:', {
        message: error.message,
        userAddress,
        page,
        limit
      });
    }
    
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
}



  // New method to add referral reward
  async addReferralReward(refferedreward: number, id?: number): Promise<ReferralRewardResponse> {
    try {
      const payload: any = { refferedreward };
      if (id) payload.id = id;

     

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/addRefferalReward`,
        {
          method: 'POST',
           body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
     

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
     

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/getRefferalRewards`
      );

      const data = await response.json();
    

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
      

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/getDailyTasks`
      );

      const data = await response.json();
     

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

  // Add daily task method
  async addDailyTask(taskData: CreateTaskPayload): Promise<TasksResponse> {
    try {


      // Extract the first task from the array for the API call
      const taskToSend = taskData.tasks[0];
      
      // Log what we're actually sending


      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/addDailyTask`,
        {
          method: 'POST',
          body: JSON.stringify(taskToSend),
        }
      );

      const data = await response.json();
      

      if (!response.ok) {
        throw new Error(data.message || data.responseMessage || 'Failed to add/update daily task');
      }

      return {
        success: true,
        message: data.message || data.responseMessage || 'Daily task added/updated successfully',
        result: data.result
      };
    } catch (error) {
      console.error('❌ Add/Update daily task error:', error);
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
export type { 
  DailyTask, 
  CreateTaskPayload, 
  TasksResponse, 
  ReferralReward, 
  GetReferralRewardResponse,
  GetReferredUsersResponse
};