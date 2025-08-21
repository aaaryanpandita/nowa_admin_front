// Enhanced UserManagement.tsx - Improved Referral Pagination
import React, { useState, useEffect } from "react";
import { Users, Award, AlertCircle, Loader } from "lucide-react";
import { apiService } from "../../../services/apiService";
import { User } from "./types/userTypes";
import { StatsCard } from "./StatsCard";
import { UserRow } from "./UserRow";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReferralTokensEarned, settotalReferralTokensEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [referralsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  
  // Enhanced state management for referral pagination
  const [userTotalReferralPages, setUserTotalReferralPages] = useState<Map<number, number>>(new Map());
  const [userReferralPages, setUserReferralPages] = useState<Map<number, number>>(new Map());
 

  // Fetch users data using your API service
  const fetchUsersData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Fetching users data for page ${page}...`);
      const response = await apiService.getAllUsersWithReferrals(page);

      if (response.success && response.data) {
        const { totalUsers, totalReferralTokensEarned, users } = response.data.result;

        // Check if users is an array before using map
        if (Array.isArray(users)) {
          const mappedUsers: User[] = users.map((user: any) => ({
            id: user.id,
            walletAddress: user.walletAddress,
            socialTasksCompleted: user.socialTasksCompleted,
            referralTasksCompleted: user.referralTasksCompleted,
            hasCompletedBoth: user.hasCompletedBoth,
            rewardEarned: user.rewardEarned,
            rewardStatus: user.rewardStatus,
            referrals: user.referredUsers
              ? user.referredUsers.map((referred: any) => ({
                  id: referred.id,
                  walletAddress: referred.walletAddress,
                  socialTasksCompleted: referred.socialTasksCompleted,
                  referralTasksCompleted: referred.referralTasksCompleted,
                  hasCompletedBoth: referred.hasCompletedBoth,
                  rewardEarned: referred.rewardEarned,
                  rewardStatus: referred.rewardStatus,
                }))
              : [],
            referralCount: user.referredUsers ? user.referredUsers.length : 0,
          }));

          // Calculate total pages dynamically
          const totalPages = Math.ceil(totalUsers / itemsPerPage);

          console.log("✅ Users data fetched successfully:", {
            totalUsers,
            totalReferralTokensEarned,
            usersCount: mappedUsers.length,
            mappedUsers,
            page,
            totalPages,
          });

          setTotalUsers(totalUsers);
          settotalReferralTokensEarned(totalReferralTokensEarned);
          setUsers(mappedUsers);
          setTotalPages(totalPages);
        } else {
          setError("Users data is not in the expected format.");
        }
      } else {
        const errorMessage = response.message || "Failed to fetch user data";
        console.error("❌ API Error:", errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error occurred";
      console.error("❌ Error fetching users:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced referral fetching with better error handling and loading states
 const fetchUserReferrals = async (userId: number, refPage: number = 1) => {
  try {
    console.log(`🔄 UserManagement: Fetching referrals for user ${userId}, refPage ${refPage}...`);

    if (!userId || isNaN(userId)) {
      console.error("❌ Invalid userId provided:", userId);
      return;
    }

    // Set loading state for this specific user
    // Make API call with both page and refPage parameters
    const response = await apiService.getAllUsersWithReferral(userId, refPage);

    console.log("📋 Referrals response:", response);

    if (response.success && response.data) {
      // Update the specific user's referrals
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                referrals: response.data!.referrals.map((referred: any) => ({
                  id: referred.id,
                  walletAddress: referred.walletAddress,
                  socialTasksCompleted: referred.socialTasksCompleted,
                  referralTasksCompleted: referred.referralTasksCompleted,
                  hasCompletedBoth: referred.hasCompletedBoth,
                  rewardEarned: referred.rewardEarned,
                  rewardStatus: referred.rewardStatus,
                })),
              }
            : user
        )
      );

      // Calculate and store total referral pages for this user
      const totalReferrals = response.data.totalReferrals || 0;
      const totalPages = Math.ceil(totalReferrals / referralsPerPage);
      
      setUserTotalReferralPages((prev) => new Map(prev).set(userId, totalPages));
      setUserReferralPages((prev) => new Map(prev).set(userId, refPage));

      console.log(`✅ Updated user ${userId} referrals: ${response.data.referrals.length} items, refPage: ${refPage}, totalPages: ${totalPages}`);
    } else {
      console.error("❌ Failed to fetch user referrals:", response.message);
    }
  } catch (err) {
    console.error("❌ Error fetching user referrals:", err);
  } 
};


  useEffect(() => {
    fetchUsersData(currentPage);
  }, [currentPage]);

  // Filter users based on search term and status filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.rewardStatus.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const currentUsers = filteredUsers;

  const handleToggleExpand = (userId: number) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      // Collapsing - clear referral data for this user
      newExpanded.delete(userId);
      setUserReferralPages(prev => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
    } else {
      // Expanding - add user and fetch first page of referrals
      newExpanded.add(userId);
      // Reset to page 1 when expanding
      setUserReferralPages(prev => new Map(prev).set(userId, 1));
      fetchUserReferrals(userId, 1);
    }
    setExpandedUsers(newExpanded);
  };

 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedUsers(new Set()); // Clear expanded users when changing main page
    setUserReferralPages(new Map()); // Clear referral pages when changing main page
    setUserTotalReferralPages(new Map()); // Clear total referral pages
  };

  // Enhanced referral page change handler
  const handleReferralPageChange = (userId: number, refPage: number) => {
    console.log(`🔄 Handling referral page change: User ${userId}, RefPage ${refPage}`);
    
    // Update the current referral page for this user
    setUserReferralPages(prev => new Map(prev).set(userId, refPage));
    
    // Fetch the referrals for the new page
    fetchUserReferrals(userId, refPage);
  };

  const filterOptions = [
    {
      value: "pending",
      label: "Pending",
      count: users.filter((u) => u.rewardStatus.toLowerCase() === "pending").length,
    },
    {
      value: "not_eligible",
      label: "Not Eligible",
      count: users.filter((u) => u.rewardStatus.toLowerCase() === "not_eligible").length,
    },
    {
      value: "none",
      label: "None",
      count: users.filter((u) => u.rewardStatus.toLowerCase() === "none").length,
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Data</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => fetchUsersData(currentPage)}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={<Users className="w-6 h-6 text-[#00FFA9]" />}
          loading={loading}
        />
        <StatsCard
          title="Total Referral Rewards"
          value={totalReferralTokensEarned.toLocaleString()}
          icon={<Award className="w-6 h-6 text-[#00FFA9]" />}
          loading={loading}
        />
        <StatsCard
          title="Active Referrals"
          value={users.reduce((acc, user) => acc + (user.referralCount || 0), 0)}
          icon={<Users className="w-6 h-6 text-[#00FFA9]" />}
          loading={loading}
        />
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
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || filterStatus !== "all") && (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Active filters:</span>
          {searchTerm && (
            <span className="bg-gray-700 px-3 py-1 rounded-full text-white flex items-center space-x-2">
              <span>Search: "{searchTerm}"</span>
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {filterStatus !== "all" && (
            <span className="bg-gray-700 px-3 py-1 rounded-full text-white flex items-center space-x-2">
              <span>
                Status: {filterOptions.find((f) => f.value === filterStatus)?.label}
              </span>
              <button
                onClick={() => setFilterStatus("all")}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Current Page Indicator */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div>
          <span className="bg-gray-700 px-3 py-1 rounded-full">
            Main Page: {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Dynamically generate page numbers */}
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded transition-colors ${
                currentPage === index + 1
                  ? "bg-[#00FFA9] text-black"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader className="w-8 h-8 animate-spin text-[#00FFA9] mx-auto mb-4" />
            <p className="text-gray-400">Loading users data...</p>
          </div>
        ) : currentUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Users Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No users available at the moment."}
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
                    referralsPerPage={referralsPerPage}
                    currentRefPage={userReferralPages.get(user.id) || 1}
                    onRefPageChange={handleReferralPageChange}
                    totalReferralPages={userTotalReferralPages.get(user.id) || 0}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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