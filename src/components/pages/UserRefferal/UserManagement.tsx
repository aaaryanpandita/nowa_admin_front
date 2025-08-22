// Enhanced UserManagement.tsx - Fixed address click issue and React warnings
import React, { useState, useEffect } from "react";
import { Users, AlertCircle, Loader, Filter } from "lucide-react";
import { apiService } from "../../../services/apiService";
import { User } from "./types/userTypes";
import { UserRow } from "./UserRow";
import { UserCard } from "./UserCard";
import { RefreshCcw } from "lucide-react";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReferralTokensEarned, setTotalReferralTokensEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [referralsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // Referral-specific state management - FIXED: Using user ID as key instead of address
  const [userReferralPagination, setUserReferralPagination] = useState<
    Map<
      number,
      {
        totalReferred: number;
        currentPage: number;
        totalPages: number;
      }
    >
  >(new Map());
  const [loadingReferrals, setLoadingReferrals] = useState<
    Map<number, boolean>
  >(new Map());

  // Fetch main users list using getAllUsers endpoint
  const fetchUsersData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Fetching users data from getAllUsers?page=${page}...`);

      const response = await apiService.getAllUsers(page);

      if (response.success && response.data) {
        const {
          totalUsers,
          totalReferralTokensEarned,
          users,
          totalPages: apiTotalPages,
        } = response.data.result;
        console.log("Users fetched:", response.data.result.users);

        // Check if users is an array before using map
        if (Array.isArray(users)) {
          const mappedUsers: User[] = users.map((user: any) => ({
            id: user.walletAddress,
            walletAddress: user.walletAddress,
            socialTasksCompleted: user.socialTasksCompleted,
            referralTasksCompleted: user.referralTasksCompleted,
            hasCompletedBoth: user.hasCompletedBoth,
            rewardEarned: user.rewardEarned,
            rewardStatus: user.rewardStatus,
            // Add social media usernames
            xusername: user.xusername || "",
            instagramusername: user.instagramusername || "",
            telegramusername: user.telegramusername || "",
            createdAt: user.createdAt || "",
            // CRITICAL: Always start with empty referrals array - they'll be loaded on demand
            referrals: [],
            // Get referral count from the main API response
            referralCount: user.totalReferred || 0,
          }));

          // Calculate total pages - prefer API response, fallback to calculation
          const calculatedTotalPages =
            apiTotalPages || Math.ceil(totalUsers / itemsPerPage);

          console.log("✅ Users data fetched successfully:", {
            totalUsers,
            totalReferralTokensEarned,
            usersCount: mappedUsers.length,
            page,
            totalPages: calculatedTotalPages,
            note: "Referrals arrays are empty - they will be loaded on demand via getReferredUsers endpoint",
          });

          setTotalUsers(totalUsers);
          setTotalReferralTokensEarned(totalReferralTokensEarned);
          setUsers(mappedUsers);
          setTotalPages(calculatedTotalPages);
        } else {
          setError("Users data is not in the expected format.");
        }
      } else {
        const errorMessage = response.message || "Failed to fetch user data";
        console.error("❌ API Error:", errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Network error occurred";
      console.error("❌ Error fetching users:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Fetch referrals for a specific user using getReferredUsers endpoint with FULL address
  const fetchUserReferrals = async (userId: number, refPage: number = 1) => {
    // Ensure correct page number is being passed
    console.log(`Fetching referrals for user ID ${userId}, page ${refPage}`);

    const user = users.find((u) => u.id === userId);
    if (!user) {
      console.error("❌ User not found for ID:", userId);
      return;
    }

    const userAddress = user.walletAddress;
    if (!userAddress || userAddress.trim() === "") {
      console.error("❌ Invalid userAddress for user ID:", userId);
      return;
    }

    setLoadingReferrals((prev) => new Map(prev).set(userId, true));

    const response = await apiService.getReferredUsers(
      userAddress,
      refPage,
      referralsPerPage
    );

    console.log("the response is",response)

    if (response.success && response.data) {
      const { referrals, pagination } = response.data;

      // Handle updating user referrals
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, referrals: referrals } : u
        )
      );

      // Update referral pagination state
      setUserReferralPagination((prev) =>
        new Map(prev).set(userId, {
          totalReferred: pagination.totalReferrals,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        })
      );
    } else {
      console.error("❌ Failed to fetch referrals for user", userId);
    }

    setLoadingReferrals((prev) => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  };

  useEffect(() => {
    fetchUsersData(currentPage);
  }, [currentPage]);

  const handleRefresh = async () => {
    // Refresh the user data from getAllUsers endpoint
    await fetchUsersData(currentPage);

    // Optionally refresh referral data for currently expanded users
    expandedUsers.forEach((userId) => {
      fetchUserReferrals(userId, 1); // Reset to first page
    });
  };

  // Filter users based on search term and status filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.walletAddress
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      user.rewardStatus.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const currentUsers = filteredUsers;

  // FIXED: Handle toggle expand using user ID consistently
  const handleToggleExpand = (userId: number) => {
    console.log(`🔄 Toggling expand for user ID ${userId}`);

    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      // Collapsing - clear referral data for this user
      newExpanded.delete(userId);
      // Clear the referrals from the user data
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, referrals: [] } : u))
      );
      // Clear pagination data using user ID
      setUserReferralPagination((prev) => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
    } else {
      // Expanding - add user and fetch first page of referrals
      newExpanded.add(userId);

      console.log(`🔄 Expanding user ${userId}, fetching referrals...`);

      // Fetch referrals starting from page 1 using user ID
      fetchUserReferrals(userId, 1);
    }
    setExpandedUsers(newExpanded);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedUsers(new Set()); // Clear expanded users when changing main page
    setUserReferralPagination(new Map()); // Clear referral pagination data
    // Clear all referrals from users when changing main page
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({ ...user, referrals: [] }))
    );
  };

  // FIXED: Handle referral page change using user ID consistently
  const handleReferralPageChange = (userId: number, refPage: number) => {
    console.log(
      `🔄 Handling referral page change: User ID ${userId}, RefPage ${refPage}`
    );

    // Update the current referral page for this user in our local state
    setUserReferralPagination((prev) => {
      const currentPagination = prev.get(userId);
      if (currentPagination) {
        return new Map(prev).set(userId, {
          ...currentPagination,
          currentPage: refPage,
        });
      }
      return prev;
    });

    // Fetch the referrals for the new page using user ID
    fetchUserReferrals(userId, refPage);
  };

  const filterOptions = [
    {
      value: "pending",
      label: "Pending",
      count: users.filter((u) => u.rewardStatus.toLowerCase() === "pending")
        .length,
    },
    {
      value: "not_eligible",
      label: "Not Eligible",
      count: users.filter(
        (u) => u.rewardStatus.toLowerCase() === "not_eligible"
      ).length,
    },
    {
      value: "none",
      label: "None",
      count: users.filter((u) => u.rewardStatus.toLowerCase() === "none")
        .length,
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Error Loading Data
          </h2>
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            User Management
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Monitor and manage user accounts and referral activities
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-4 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
            />
          </div>

          <div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#00FFA9] text-white rounded-xl hover:bg-[#00e59e] transition-colors"
            >
              <RefreshCcw className="w-5 h-5 mr-2 inline-block" />
              Refresh Data
            </button>
          </div>

          {/* Filter Dropdown for Mobile */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white flex items-center justify-between hover:bg-gray-600 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>
                  {filterStatus === "all"
                    ? "All Status"
                    : filterOptions.find((f) => f.value === filterStatus)
                        ?.label}
                </span>
              </span>
              <span className="text-sm">▼</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 border border-gray-600 rounded-xl shadow-xl z-20">
                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-gray-600 transition-colors"
                >
                  All Status ({users.length})
                </button>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterStatus(option.value);
                      setShowFilterDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-gray-600 transition-colors"
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || filterStatus !== "all") && (
        <div className="flex flex-wrap items-center space-x-2 space-y-2 text-sm">
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
                Status:{" "}
                {filterOptions.find((f) => f.value === filterStatus)?.label}
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

      {/* Pagination Controls - Mobile Friendly */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 text-sm text-gray-400">
        <div>
          <span className="bg-gray-700 px-3 py-1 rounded-full">
            Page: {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Show fewer page numbers on mobile */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else {
                // Show pages around current page for mobile
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + 4);
                pageNum = start + index;
                if (pageNum > end) return null;
              }

              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === pageNum
                      ? "bg-[#00FFA9] text-black"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Users Content - Responsive Layout */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader className="w-8 h-8 animate-spin text-[#00FFA9] mx-auto mb-4" />
            <p className="text-gray-400">Loading users data...</p>
          </div>
        ) : currentUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Users Found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No users available at the moment."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-6 text-gray-400 font-medium">
                      User
                    </th>
                    <th className="text-left p-6 text-gray-400 font-medium">
                      Referrals
                    </th>
                    <th className="text-left p-6 text-gray-400 font-medium">
                      Rewards Earned
                    </th>
                    <th className="text-center p-6 text-gray-400 font-medium">
                      Social Tasks
                    </th>
                    <th className="text-center p-6 text-gray-400 font-medium">
                      Referral Tasks
                    </th>
                    <th className="text-center p-6 text-gray-400 font-medium">
                      Created
                    </th>
                    <th className="text-center p-6 text-gray-400 font-medium">
                      Instagram
                    </th>
                    <th className="text-center p-6 text-gray-400 font-medium">
                      X
                    </th>
                    <th className="text-center p-6 text-gray-400 font-medium">
                      Telegram
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => {
                    const referralPagination = userReferralPagination.get(
                      user.id
                    );

                    return (
                      <UserRow
                        key={`user-${user.id}-${user.walletAddress}`} // FIXED: Unique key
                        user={user}
                        onToggleExpand={handleToggleExpand}
                        isExpanded={expandedUsers.has(user.id)}
                        referralsPerPage={referralsPerPage}
                        currentRefPage={referralPagination?.currentPage || 1}
                        onRefPageChange={handleReferralPageChange}
                        totalReferralPages={referralPagination?.totalPages || 0}
                        isLoadingReferrals={
                          loadingReferrals.get(user.id) || false
                        }
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Hidden on Desktop */}
            <div className="lg:hidden">
              {currentUsers.map((user) => {
                const referralPagination = userReferralPagination.get(user.id);
                return (
                  <UserCard
                    key={`user-card-${user.id}-${user.walletAddress}`} // FIXED: Unique key
                    user={user}
                    onToggleExpand={handleToggleExpand}
                    isExpanded={expandedUsers.has(user.id)}
                    referralsPerPage={referralsPerPage}
                    currentRefPage={referralPagination?.currentPage || 1}
                    onRefPageChange={handleReferralPageChange}
                    totalReferralPages={referralPagination?.totalPages || 0}
                    isLoadingReferrals={loadingReferrals.get(user.id) || false}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;
