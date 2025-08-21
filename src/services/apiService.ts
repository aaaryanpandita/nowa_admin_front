// services/apiService.ts - Fixed for proper dynamic pagination
const API_BASE_URL = 'https://nowa-ref-api.tarality.io/api/v1';

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
    users: string;
    referredUsers: string;
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

// Enhanced interface for user referrals response
interface UserReferralsResponse {
  success: boolean;
  data?: {
    referrals: any[];
    totalReferrals: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
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

  // Enhanced method with dynamic pagination support - supports both page and refPage
  async getAllUsersWithReferrals(page: number = 1, refPage?: number): Promise<ApiResponse<DashboardData>> {
    try {
      // Build query parameters dynamically
      const params = new URLSearchParams();
      params.append('page', page.toString());
      
      if (refPage && refPage > 0) {
        params.append('refPage', refPage.toString());
      }

      const url = `${API_BASE_URL}/admin/getAllUsersWithReferrals?${params.toString()}`;
      console.log(`🔄 Fetching users data: ${url}`);
      
      const response = await this.authenticatedFetch(url);
      const data = await response.json();
      console.log("📋 Main users response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      const { totalUsers, totalReferralTokensEarned, users, referredUsers } = data.result;
      
      console.log("📊 Users count:", data.result.users?.length || 0);

      return {
        success: true,
        data: {
          result: {
            totalUsers,
            totalReferralTokensEarned,
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

  // New method - specifically for getting user referrals with pagination
  async getUserReferrals(userId: number, refPage: number = 1): Promise<UserReferralsResponse> {
    try {
      // Validate inputs
      if (!userId || isNaN(userId) || userId <= 0) {
        console.error('❌ Invalid userId provided:', userId);
        return {
          success: false,
          data: null,
          message: 'Invalid user ID provided'
        };
      }

      if (!refPage || isNaN(refPage) || refPage <= 0) {
        console.error('❌ Invalid refPage provided:', refPage);
        refPage = 1; // Default to page 1
      }

      console.log(`🔄 Fetching referrals for user ${userId}, refPage ${refPage}...`);
      
      // Use the correct endpoint with proper structure
      const url = `${API_BASE_URL}/admin/getAllUsersWithReferrals?page=1&refPage=${refPage}&userId=${userId}`;
      console.log(`📍 API URL: ${url}`);
      
      const response = await this.authenticatedFetch(url);
      const data = await response.json();
      
      console.log(`📋 User ${userId} referrals response (refPage ${refPage}):`, data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user referrals');
      }

      // Extract referral data from response - adjust based on your actual API response structure
      let referrals = [];
      let totalReferrals = 0;

      // Check if the response has the expected structure
      if (data.result && data.result.users) {
        // Find the specific user's data
        const userData = Array.isArray(data.result.users) 
          ? data.result.users.find((user: any) => user.id === userId)
          : data.result.users;

        if (userData && userData.referredUsers) {
          referrals = userData.referredUsers;
          totalReferrals = userData.totalReferrals || referrals.length;
        }
      } else if (data.result && data.result.referrals) {
        // Alternative structure
        referrals = data.result.referrals;
        totalReferrals = data.result.totalReferrals || referrals.length;
      }

      const referralsPerPage = 10;
      const totalPages = Math.ceil(totalReferrals / referralsPerPage);

      console.log(`✅ User ${userId} referrals fetched: ${referrals.length} items, refPage ${refPage}/${totalPages}`);

      return {
        success: true,
        data: {
          referrals: referrals,
          totalReferrals: totalReferrals,
          currentPage: refPage,
          totalPages: totalPages,
          hasNextPage: refPage < totalPages,
          hasPrevPage: refPage > 1
        },
        message: data.message
      };
    } catch (error) {
      console.error('❌ Get user referrals error:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Keep the old method for backward compatibility but redirect to new implementation
  async getAllUsersWithReferral(userId: number, refPage: number = 1): Promise<UserReferralsResponse> {
    console.log('⚠️ Using deprecated method getAllUsersWithReferral, redirecting to getUserReferrals');
    return this.getUserReferrals(userId, refPage);
  }

  // Alternative method if the API structure is different
  async getUserReferralsAlternative(userId: number, refPage: number = 1): Promise<UserReferralsResponse> {
    try {
      // Validate inputs
      if (!userId || isNaN(userId) || userId <= 0) {
        console.error('❌ Invalid userId provided:', userId);
        return {
          success: false,
          data: null,
          message: 'Invalid user ID provided'
        };
      }

      if (!refPage || isNaN(refPage) || refPage <= 0) {
        refPage = 1; // Default to page 1
      }

      console.log(`🔄 Alternative: Fetching referrals for user ${userId}, refPage ${refPage}...`);
      
      // Try different endpoint patterns
      const possibleUrls = [
        `${API_BASE_URL}/admin/getUserReferrals?userId=${userId}&refPage=${refPage}`,
        `${API_BASE_URL}/admin/user/${userId}/referrals?page=${refPage}`,
        `${API_BASE_URL}/admin/users/${userId}/referrals?refPage=${refPage}`,
        `${API_BASE_URL}/admin/getAllUsersWithReferrals/${userId}?refPage=${refPage}`
      ];

      let lastError = null;

      for (const url of possibleUrls) {
        try {
          console.log(`🔄 Trying URL: ${url}`);
          const response = await this.authenticatedFetch(url);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Success with URL: ${url}`, data);
            
            // Process the response based on the actual structure
            let referrals = [];
            let totalReferrals = 0;

            if (data.result) {
              if (data.result.referrals) {
                referrals = data.result.referrals;
                totalReferrals = data.result.totalReferrals || referrals.length;
              } else if (data.result.referredUsers) {
                referrals = data.result.referredUsers;
                totalReferrals = data.result.totalReferrals || referrals.length;
              } else if (Array.isArray(data.result)) {
                referrals = data.result;
                totalReferrals = referrals.length;
              }
            }

            const referralsPerPage = 10;
            const totalPages = Math.ceil(totalReferrals / referralsPerPage);

            return {
              success: true,
              data: {
                referrals: referrals,
                totalReferrals: totalReferrals,
                currentPage: refPage,
                totalPages: totalPages,
                hasNextPage: refPage < totalPages,
                hasPrevPage: refPage > 1
              },
              message: data.message
            };
          }
        } catch (error) {
          lastError = error;
          console.log(`❌ Failed with URL: ${url}`, error);
        }
      }

      throw lastError || new Error('All endpoint attempts failed');

    } catch (error) {
      console.error('❌ Get user referrals alternative error:', error);
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

      console.log('🚀 Adding referral reward:', refferedreward);

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/addRefferalReward`,
        {
          method: 'POST',
           body: JSON.stringify(payload),
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

  // Add daily task method
  async addDailyTask(taskData: CreateTaskPayload): Promise<TasksResponse> {
    try {
      console.log('🚀 Adding or updating task(s):', taskData);

      // Extract the first task from the array for the API call
      const taskToSend = taskData.tasks[0];
      
      // Log what we're actually sending
      console.log('📤 Sending task data:', taskToSend);

      const response = await this.authenticatedFetch(
        `${API_BASE_URL}/admin/addDailyTask`,
        {
          method: 'POST',
          body: JSON.stringify(taskToSend),
        }
      );

      const data = await response.json();
      console.log('📤 Add/Update task response:', data);

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
  UserReferralsResponse 
};