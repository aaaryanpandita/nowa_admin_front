// Enhanced UserManagement.tsx - Simplified search with cleaner UI
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Users,
  AlertCircle,
  Loader,
  Filter,
  Search,
  Download,
  RefreshCcw,
} from "lucide-react";
import { apiService } from "../../../services/apiService";
import { User } from "./types/userTypes";
import { UserRow } from "./UserRow";
import { UserCard } from "./UserCard";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReferralTokensEarned, setTotalReferralTokensEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  // Add this near your other state declarations
  const searchAbortControllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [referralsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // Simplified search state management
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Referral-specific state management
  const [userReferralPagination, setUserReferralPagination] = useState<
    Map<
      number,
      { totalReferred: number; currentPage: number; totalPages: number }
    >
  >(new Map());
  const [loadingReferrals, setLoadingReferrals] = useState<
    Map<number, boolean>
  >(new Map());

  // Smart search function - stops as soon as results are found
  const performGlobalSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setIsSearchMode(false);
        setSearchResults([]);
        return;
      }

      // Cancel any ongoing search
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }

      // Create new abort controller for this search
      const abortController = new AbortController();
      searchAbortControllerRef.current = abortController;

      setIsSearching(true);
      setIsSearchMode(true);

      try {
        const searchResults: User[] = [];
        let searchPage = 1;
        let totalPagesFound = totalPages || 1;

        // Search page by page, stop when results are found or cancelled
        while (
          searchPage <= totalPagesFound &&
          !abortController.signal.aborted
        ) {
          const response = await apiService.getAllUsers(searchPage);

          // Check if search was cancelled
          if (abortController.signal.aborted) {
            console.log("Search cancelled");
            return;
          }

          if (response.success && response.data) {
            const { users: pageUsers, totalPages: apiTotalPages } =
              response.data.result;

            if (apiTotalPages && apiTotalPages !== totalPagesFound) {
              totalPagesFound = apiTotalPages;
            }

            if (Array.isArray(pageUsers) && pageUsers.length > 0) {
              const mappedUsers: User[] = pageUsers.map((user: any) => ({
                id: user.walletAddress,
                walletAddress: user.walletAddress,
                socialTasksCompleted: user.socialTasksCompleted,
                referralTasksCompleted: user.referralTasksCompleted,
                hasCompletedBoth: user.hasCompletedBoth,
                rewardEarned: user.rewardEarned,
                rewardStatus: user.rewardStatus,
                xusername: user.xusername || "",
                instagramusername: user.instagramusername || "",
                telegramusername: user.telegramusername || "",
                createdAt: user.createdAt || "",
                referrals: [],
                referralCount: user.totalReferred || 0,
              }));

              const matchingUsers = mappedUsers.filter((user) =>
                user.walletAddress
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              );

              if (matchingUsers.length > 0) {
                searchResults.push(...matchingUsers);
                break;
              }
            }

            searchPage++;
          } else {
            break;
          }

          // Check again before delay
          if (abortController.signal.aborted) {
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Only update state if search wasn't cancelled
        if (!abortController.signal.aborted) {
          setSearchResults(searchResults);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
          setError("Error occurred during search. Please try again.");
        }
      } finally {
        // Only update loading state if this is still the current search
        if (searchAbortControllerRef.current === abortController) {
          setIsSearching(false);
          searchAbortControllerRef.current = null;
        }
      }
    },
    [totalPages]
  );

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchTerm.trim()) {
        performGlobalSearch(searchTerm);
      } else {
        // Cancel any ongoing search when clearing
        if (searchAbortControllerRef.current) {
          searchAbortControllerRef.current.abort();
          searchAbortControllerRef.current = null;
        }
        setIsSearchMode(false);
        setSearchResults([]);
        setIsSearching(false); // Add this line
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, performGlobalSearch]);

  // Optimized user data fetching
  const fetchUsersData = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.getAllUsers(page);

        if (response.success && response.data) {
          const {
            totalUsers,
            totalReferralTokensEarned,
            users,
            totalPages: apiTotalPages,
          } = response.data.result;

          if (Array.isArray(users)) {
            const mappedUsers: User[] = users.map((user: any) => ({
              id: user.walletAddress,
              walletAddress: user.walletAddress,
              socialTasksCompleted: user.socialTasksCompleted,
              referralTasksCompleted: user.referralTasksCompleted,
              hasCompletedBoth: user.hasCompletedBoth,
              rewardEarned: user.rewardEarned,
              rewardStatus: user.rewardStatus,
              xusername: user.xusername || "",
              instagramusername: user.instagramusername || "",
              telegramusername: user.telegramusername || "",
              createdAt: user.createdAt || "",
              referrals: [],
              referralCount: user.totalReferred || 0,
            }));

            const calculatedTotalPages =
              apiTotalPages || Math.ceil(totalUsers / itemsPerPage);

            // console.log("✅ Users data fetched successfully:", {
            //   totalUsers,
            //   totalReferralTokensEarned,
            //   usersCount: mappedUsers.length,
            //   page,
            //   totalPages: calculatedTotalPages,
            // });

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
    },
    [itemsPerPage]
  );

  // Optimized referral fetching
  const fetchUserReferrals = useCallback(
    async (userId: number, refPage: number = 1) => {
      const currentUserList = isSearchMode ? searchResults : users;
      const user = currentUserList.find((u) => u.id === userId);

      if (!user?.walletAddress?.trim()) {
        console.error("❌ Invalid user or walletAddress for user ID:", userId);
        return;
      }

      setLoadingReferrals((prev) => new Map(prev).set(userId, true));

      try {
        const response = await apiService.getReferredUsers(
          user.walletAddress,
          refPage,
          referralsPerPage
        );

        if (response.success && response.data) {
          const { referrals, pagination } = response.data;

          // Update user referrals in both users and searchResults
          const updateUserReferrals = (prevUsers: User[]) =>
            prevUsers.map((u) => (u.id === userId ? { ...u, referrals } : u));

          setUsers(updateUserReferrals);
          if (isSearchMode) {
            setSearchResults(updateUserReferrals);
          }

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
      } catch (error) {
        console.error("❌ Error fetching referrals:", error);
      } finally {
        setLoadingReferrals((prev) => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      }
    },
    [users, searchResults, isSearchMode, referralsPerPage]
  );

  // Initialize data
  useEffect(() => {
    fetchUsersData(currentPage);
  }, [currentPage, fetchUsersData]);

  // Optimized refresh handler
  const handleRefresh = useCallback(async () => {
    setIsSearchMode(false);
    setSearchResults([]);
    setSearchTerm("");
    setExpandedUsers(new Set());
    setUserReferralPagination(new Map());

    await fetchUsersData(currentPage);
  }, [currentPage, fetchUsersData]);

  // Clear search handler
  const handleClearSearch = useCallback(() => {
    // Cancel any ongoing search
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
      searchAbortControllerRef.current = null;
    }

    setSearchTerm("");
    setIsSearchMode(false);
    setSearchResults([]);
    setIsSearching(false); // Add this line
    setExpandedUsers(new Set());
    setUserReferralPagination(new Map());
  }, []);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    const currentUserList = isSearchMode ? searchResults : users;

    return currentUserList.filter((user) => {
      const matchesFilter =
        filterStatus === "all" ||
        user.rewardStatus.toLowerCase() === filterStatus.toLowerCase();
      return matchesFilter;
    });
  }, [users, searchResults, isSearchMode, filterStatus]);

  // Memoized filter options
  const filterOptions = useMemo(
    () => [
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
    ],
    [users]
  );

  // Optimized expand handler
  const handleToggleExpand = useCallback(
    (userId: number) => {
      setExpandedUsers((prev) => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(userId)) {
          newExpanded.delete(userId);

          // Clear referral data
          const clearReferrals = (prevUsers: User[]) =>
            prevUsers.map((u) =>
              u.id === userId ? { ...u, referrals: [] } : u
            );

          setUsers(clearReferrals);
          if (isSearchMode) {
            setSearchResults(clearReferrals);
          }

          setUserReferralPagination((prev) => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });
        } else {
          newExpanded.add(userId);
          fetchUserReferrals(userId, 1);
        }
        return newExpanded;
      });
    },
    [isSearchMode, fetchUserReferrals]
  );

  // Add this utility function for CSV export
  const exportToCSV = (users: User[], filename: string = "users-data.csv") => {
    // CSV headers
    const headers = [
      "Wallet Address",
      "Social Tasks Completed",
      "Referral Tasks Completed",
      "Reward Earned",
      "Reward Status",
      "Referral Count",
      "Instagram Username",
      "X Username",
      "Telegram Username",
      "Created At",
    ];

    // Convert users data to CSV rows
    const csvData = users.map((user) => [
      user.walletAddress,
      user.socialTasksCompleted ? "Yes" : "No",
      user.referralTasksCompleted ? "Yes" : "No",
      user.rewardEarned,
      user.rewardStatus,
      user.referralCount || 0,
      user.instagramusername || "",
      user.xusername || "",
      user.telegramusername || "",
      user.createdAt || "",
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Add this new function after fetchUsersData
  const fetchAllUsersForCSV = useCallback(async () => {
    const allUsers: User[] = [];
    let page = 1;
    let totalPagesAPI = totalPages || 1;

    try {
      while (page <= totalPagesAPI) {
        const response = await apiService.getAllUsers(page);

        if (response.success && response.data) {
          const { users: pageUsers, totalPages: apiTotalPages } =
            response.data.result;

          if (apiTotalPages && apiTotalPages !== totalPagesAPI) {
            totalPagesAPI = apiTotalPages;
          }

          if (Array.isArray(pageUsers) && pageUsers.length > 0) {
            const mappedUsers: User[] = pageUsers.map((user: any) => ({
              id: user.walletAddress,
              walletAddress: user.walletAddress,
              socialTasksCompleted: user.socialTasksCompleted,
              referralTasksCompleted: user.referralTasksCompleted,
              hasCompletedBoth: user.hasCompletedBoth,
              rewardEarned: user.rewardEarned,
              rewardStatus: user.rewardStatus,
              xusername: user.xusername || "",
              instagramusername: user.instagramusername || "",
              telegramusername: user.telegramusername || "",
              createdAt: user.createdAt || "",
              referrals: [],
              referralCount: user.totalReferred || 0,
            }));

            allUsers.push(...mappedUsers);
          }

          page++;
        } else {
          break;
        }
      }

      return allUsers;
    } catch (error) {
      console.error("Error fetching all users for CSV:", error);
      throw error;
    }
  }, [totalPages]);

  // Replace the existing handleExportCSV function with this
  const handleExportCSV = useCallback(async () => {
    // For search results, use the current search data
    if (isSearchMode) {
      const filename = `Wallets CSV Data-${searchTerm}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      exportToCSV(searchResults, filename);
      return;
    }

    // For normal mode, fetch ALL users data
    try {
      setLoading(true); // Show loading indicator
      const allUsers = await fetchAllUsersForCSV();
      const filename = `Wallets CSV Data-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      exportToCSV(allUsers, filename);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setError("Failed to Download CSV. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isSearchMode, searchResults, searchTerm, fetchAllUsersForCSV]);

  // Add this handler function

  // Optimized page change handler
  const handlePageChange = useCallback(
    (page: number) => {
      if (isSearchMode) return;

      setCurrentPage(page);
      setExpandedUsers(new Set());
      setUserReferralPagination(new Map());
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({ ...user, referrals: [] }))
      );
    },
    [isSearchMode]
  );

  // Optimized referral page change handler
  const handleReferralPageChange = useCallback(
    (userId: number, refPage: number) => {
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

      fetchUserReferrals(userId, refPage);
    },
    [fetchUserReferrals]
  );

  if (error && !isSearchMode) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0"></div>

      {/* Search and Filter */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search wallet addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-lg"
                  title="Clear search"
                  type="button"
                >
                  ×
                </button>
              )}

              {/* Simplified Search Loading Indicator */}
              {isSearching && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <Loader className="w-4 h-4 animate-spin text-[#00FFA9]" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              disabled={isSearching || filteredUsers.length === 0}
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export current data to CSV"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline"> Download CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isSearching}
              className="flex items-center px-4 py-2 bg-[#00FFA9] text-black rounded-xl hover:bg-[#00e59e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(isSearchMode || filterStatus !== "all") && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-400">Active filters:</span>
          {isSearchMode && (
            <span className="bg-[#00FFA9] px-3 py-1 rounded-full text-black flex flex-wrap items-center gap-1 sm:gap-2 max-w-full">
              <Search className="w-3 h-3 flex-shrink-0" />

              {/* Search text */}
              <span className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                Search: "{searchTerm}"
                {!isSearching && ` (${searchResults.length} found)`}
                {isSearching && " (searching...)"}
              </span>

              {/* Clear button */}
              <button
                onClick={handleClearSearch}
                className="text-black/70 hover:text-black text-lg leading-none flex-shrink-0"
                disabled={isSearching}
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

      {/* Pagination Controls - Only show when not in search mode */}
      {!isSearchMode && (
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

            <div className="flex items-center space-x-1">
              {(() => {
                const pages = [];

                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  if (currentPage <= 3) {
                    pages.push(1, 2, 3, 4, "...", totalPages);
                  } else if (currentPage >= totalPages - 2) {
                    pages.push(
                      1,
                      "...",
                      totalPages - 3,
                      totalPages - 2,
                      totalPages - 1,
                      totalPages
                    );
                  } else {
                    pages.push(
                      1,
                      "...",
                      currentPage - 1,
                      currentPage,
                      currentPage + 1,
                      "...",
                      totalPages
                    );
                  }
                }

                return pages.map((pageNum, index) => {
                  if (pageNum === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => handlePageChange(pageNum as number)}
                      className={`px-3 py-1 rounded transition-colors ${
                        currentPage === pageNum
                          ? "bg-[#00FFA9] text-black"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}
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
      )}

      {/* Users Content - Responsive Layout */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
        {loading && !isSearchMode ? (
          <div className="p-12 text-center">
            <Loader className="w-8 h-8 animate-spin text-[#00FFA9] mx-auto mb-4" />
            <p className="text-gray-400">Loading users data...</p>
          </div>
        ) : isSearching ? (
          <div className="p-12 text-center">
            <Loader className="w-8 h-8 animate-spin text-[#00FFA9] mx-auto mb-4" />
            <p className="text-gray-400">Searching for "{searchTerm}"...</p>
            <p className="text-gray-500 text-sm mt-2">
              Please wait while we search through all users
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {isSearchMode ? "No Users Found" : "No Users Found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {isSearchMode
                ? `No users found matching "${searchTerm}".`
                : filterStatus !== "all"
                ? "Try adjusting your filter criteria."
                : "No users available at the moment."}
            </p>
            {isSearchMode && (
              <div className="space-y-2">
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-[#00FFA9] text-black rounded-xl hover:bg-[#00e59e] transition-colors"
                >
                  Clear Search
                </button>
                <p className="text-xs text-gray-500">
                  Try searching for a different wallet address or part of an
                  address
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search Results Header */}
            {isSearchMode && (
              <div className="bg-[#00FFA9]/10 border-b border-[#00FFA9]/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00FFA9] rounded-full"></div>
                    <span className="text-[#00FFA9] font-medium">
                      Search Results: {searchResults.length} user(s) found for "
                      {searchTerm}"
                    </span>
                  </div>
                  <button
                    onClick={handleClearSearch}
                    className="text-[#00FFA9] hover:text-white transition-colors text-sm font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

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
                  {filteredUsers.map((user) => {
                    const referralPagination = userReferralPagination.get(
                      user.id
                    );

                    return (
                      <UserRow
                        key={`user-${user.id}-${user.walletAddress}`}
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
              {filteredUsers.map((user) => {
                const referralPagination = userReferralPagination.get(user.id);
                return (
                  <UserCard
                    key={`user-card-${user.id}-${user.walletAddress}`}
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
