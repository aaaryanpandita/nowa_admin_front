// UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { Users, Award, AlertCircle, Loader } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { User } from './types/userTypes';
import { StatsCard } from './StatsCard';
import { UserRow } from './UserRow';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalGlobalReward, setTotalGlobalReward] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Fetch users data using your API service
const fetchUsersData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('🔄 Fetching users data...');
    const response = await apiService.getAllUsersWithReferrals();

    console.log("the res is", response);
    
    if (response.success && response.data) {
      const { totalUsers, totalGlobalReward, users } = response.data.result;

      // Check if users is an array before using map
      if (Array.isArray(users)) {
        // Map the data to match frontend structure
        const mappedUsers: User[] = users.map((user: any) => ({
          id: user.id,
          walletAddress: user.walletAddress,
          socialTasksCompleted: user.socialTasksCompleted,
          referralTasksCompleted: user.referralTasksCompleted,
          hasCompletedBoth: user.hasCompletedBoth,
          rewardEarned: user.rewardEarned,
          rewardStatus: user.rewardStatus,
          // Map referredUsers to referrals for frontend compatibility
          referrals: user.referredUsers ? user.referredUsers.map((referred: any) => ({
            id: referred.id,
            walletAddress: referred.walletAddress,
            socialTasksCompleted: referred.socialTasksCompleted,
            referralTasksCompleted: referred.referralTasksCompleted,
            hasCompletedBoth: referred.hasCompletedBoth,
            rewardEarned: referred.rewardEarned,
            rewardStatus: referred.rewardStatus,
          })) : [],
          referralCount: user.referredUsers ? user.referredUsers.length : 0
        }));

        console.log('✅ Users data fetched successfully:', {
          totalUsers,
          totalGlobalReward,
          usersCount: mappedUsers.length,
          mappedUsers
        });

        setTotalUsers(totalUsers);
        setTotalGlobalReward(totalGlobalReward);
        setUsers(mappedUsers);
      } else {
        setError("Users data is not in the expected format.");
      }
    } else {
      const errorMessage = response.message || 'Failed to fetch user data';
      console.error('❌ API Error:', errorMessage);
      setError(errorMessage);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
    console.error('❌ Error fetching users:', err);
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUsersData();
  }, []);

  // Filter users based on search term and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.rewardStatus.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleToggleExpand = (userId: number) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const handleFilter = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterSelect = (status: string) => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedUsers(new Set()); // Clear expanded users when changing page
  };

  const filterOptions = [
    { value: 'pending', label: 'Pending', count: users.filter(u => u.rewardStatus.toLowerCase() === 'pending').length },
    { value: 'not_eligible', label: 'Not Eligible', count: users.filter(u => u.rewardStatus.toLowerCase() === 'not_eligible').length },
    { value: 'none', label: 'None', count: users.filter(u => u.rewardStatus.toLowerCase() === 'none').length }
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Data</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchUsersData}
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-2">Monitor and manage user accounts and referral activities</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-4 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
            />
          </div>
          <div className="flex items-center space-x-3">
            {/* Filter Dropdown - You can add this back if needed */}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || filterStatus !== 'all') && (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Active filters:</span>
          {searchTerm && (
            <span className="bg-gray-700 px-3 py-1 rounded-full text-white flex items-center space-x-2">
              <span>Search: "{searchTerm}"</span>
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-white">×</button>
            </span>
          )}
          {filterStatus !== 'all' && (
            <span className="bg-gray-700 px-3 py-1 rounded-full text-white flex items-center space-x-2">
              <span>Status: {filterOptions.find(f => f.value === filterStatus)?.label}</span>
              <button onClick={() => setFilterStatus('all')} className="text-gray-400 hover:text-white">×</button>
            </span>
          )}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader className="w-8 h-8 animate-spin text-[#00FFA9] mx-auto mb-4" />
            <p className="text-gray-400">Loading users data...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Users Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filter criteria.' : 'No users available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-6 text-gray-400 font-medium">User</th>
                  <th className="text-left p-6 text-gray-400 font-medium">Referrals</th>
                  <th className="text-left p-6 text-gray-400 font-medium">Rewards Earned</th>
                  <th className="text-center p-6 text-gray-400 font-medium">Social Tasks</th>
                  <th className="text-center p-6 text-gray-400 font-medium">Referral Tasks</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onToggleExpand={handleToggleExpand}
                    isExpanded={expandedUsers.has(user.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === page
                      ? 'bg-[#00FFA9] text-black'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showFilterDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;