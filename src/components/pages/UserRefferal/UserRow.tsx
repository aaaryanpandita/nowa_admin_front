// Enhanced UserRow.tsx - Fixed referral pagination logic
import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Award,
  Check,
  X,
  ChevronLeft,
  Loader,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { User } from "./types/userTypes";

interface UserRowProps {
  user: User;
  onToggleExpand: (userId: number) => void;
  isExpanded: boolean;
  referralsPerPage?: number;
  currentRefPage?: number;
  onRefPageChange?: (userId: number, page: number) => void;
  totalReferralPages?: number;
  isLoadingReferrals?: boolean;
}

export const UserRow: React.FC<UserRowProps> = ({
  user,
  onToggleExpand,
  isExpanded,
  referralsPerPage = 10,
  currentRefPage = 1,
  onRefPageChange,
  totalReferralPages = 0,
  isLoadingReferrals = false,
}) => {
  const TaskStatus: React.FC<{ completed: boolean; label: string }> = ({
    completed,
    label,
  }) => (
    <div className="flex items-center space-x-2">
      <div
        className={`flex items-center justify-center w-5 h-5 rounded-full ${
          completed
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {completed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      </div>
      <span
        className={`text-sm ${completed ? "text-green-400" : "text-red-400"}`}
      >
        {label}
      </span>
    </div>
  );

  const SocialMediaDisplay: React.FC<{
    username?: string;
    platform: "instagram" | "x" | "telegram";
  }> = ({ username = "", platform }) => {
    if (!username || username.trim() === "") {
      return <span className="text-gray-500 text-sm">-</span>;
    }

    const getIcon = () => {
      switch (platform) {
        case "instagram":
          return <Instagram className="w-3 h-3" />;
        case "x":
          return (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          );
        case "telegram":
          return <MessageCircle className="w-3 h-3" />;
        default:
          return null;
      }
    };

    const getPlatformColor = () => {
      switch (platform) {
        case "instagram":
          return "text-pink-400";
        case "x":
          return "text-blue-400";
        case "telegram":
          return "text-cyan-400";
        default:
          return "text-gray-400";
      }
    };

    return (
      <div className="flex items-center space-x-1 justify-center">
        <div className={getPlatformColor()}>{getIcon()}</div>
        <span className="text-white text-sm font-mono max-w-20 " title={`@${username}`}>
          @{username}
        </span>
      </div>
    );
  };

  // Fixed: Handle optional date string with proper type checking
  const formatDate = (dateString?: string): string => {
    if (!dateString || dateString.trim() === "") return "-";

    try {
      // Handle different date formats that might come from the API
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if parsing fails
      }

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  const handleRowClick = () => {
    if (user.referralCount && user.referralCount > 0) {
      onToggleExpand(user.id);
    }
  };

  const handleReferralPageChange = (page: number) => {
    if (onRefPageChange) {
      console.log(
        `🔄 Changing referral page for user ${user.id} to page ${page}`
      );
      onRefPageChange(user.id, page);
    }
  };

  // Calculate total referral pages from the user's referral count
  const calculatedTotalPages = user.referralCount
    ? Math.ceil(user.referralCount / referralsPerPage)
    : 0;
  const actualTotalPages = totalReferralPages || calculatedTotalPages;

  const currentReferrals = user.referrals || [];

  // SINGLE pagination function for referrals - no duplication
  const generateReferralPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (actualTotalPages <= maxVisiblePages) {
      // If total pages are less than or equal to max visible, show all
      for (let i = 1; i <= actualTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // More complex logic for many pages
      if (currentRefPage <= 3) {
        // Show first few pages + last page
        pages.push(1, 2, 3, 4);
        if (actualTotalPages > 5) {
          pages.push("...", actualTotalPages);
        } else {
          pages.push(5);
        }
      } else if (currentRefPage >= actualTotalPages - 2) {
        // Show first page + last few pages
        pages.push(
          1,
          "...",
          actualTotalPages - 3,
          actualTotalPages - 2,
          actualTotalPages - 1,
          actualTotalPages
        );
      } else {
        // Show first + current range + last
        pages.push(
          1,
          "...",
          currentRefPage - 1,
          currentRefPage,
          currentRefPage + 1,
          "...",
          actualTotalPages
        );
      }
    }

    return pages;
  };

  const referralPageNumbers = generateReferralPageNumbers();

  return (
    <>
      {/* Main User Row */}
      <tr
        className={`border-b border-gray-700/50 transition-colors ${
          user.referralCount && user.referralCount > 0
            ? "hover:bg-gray-700/30 cursor-pointer"
            : "hover:bg-gray-700/10"
        }`}
        onClick={handleRowClick}
      >
        <td className="p-4 lg:p-6">
          <div className="flex items-center space-x-3">
            {user.referralCount && user.referralCount > 0 ? (
              <div className="text-gray-400 transition-colors">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            ) : (
              <div className="w-4 h-4"></div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium text-sm lg:text-base font-mono break-all" title={user.walletAddress}>
                <span className="hidden lg:inline">{user.walletAddress}</span>
                <span className="lg:hidden">
                  {user.walletAddress.length > 20
                    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-6)}`
                    : user.walletAddress}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {!user.socialTasksCompleted && user.referralTasksCompleted && (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                    Referral Complete
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>
        <td className="p-4 lg:p-6">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#00FFA9]" />
            <span className="text-white font-medium">
              {user.referralCount || 0}
            </span>
            
          </div>
        </td>
        <td className="p-4 lg:p-6">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-medium">{user.rewardEarned}</span>
          </div>
        </td>
        <td className="p-4 lg:p-6 text-center">
          <div
            className={`text-sm ${
              user.socialTasksCompleted ? "text-green-400" : "text-red-400"
            }`}
          >
            <span className="hidden lg:inline">
              {user.socialTasksCompleted ? "Completed" : "Not Completed"}
            </span>
            <span className="lg:hidden">
              {user.socialTasksCompleted ? "✓" : "✗"}
            </span>
          </div>
        </td>
        <td className="p-4 lg:p-6 text-center">
          <div
            className={`text-sm ${
              user.referralTasksCompleted ? "text-green-400" : "text-red-400"
            }`}
          >
            <span className="hidden lg:inline">
              {user.referralTasksCompleted ? "Completed" : "Not Completed"}
            </span>
            <span className="lg:hidden">
              {user.referralTasksCompleted ? "✓" : "✗"}
            </span>
          </div>
        </td>
        <td className="p-4 lg:p-6 text-center">
          <span className="text-white text-sm">
            {formatDate(user.createdAt)}
          </span>
        </td>
        <td className="p-4 lg:p-8 text-center">
          <SocialMediaDisplay
            username={user.instagramusername}
            platform="instagram"
          />
        </td>
        <td className="p-4 lg:p-6 text-center">
          <SocialMediaDisplay username={user.xusername} platform="x" />
        </td>
        <td className="p-4 lg:p-6 text-center">
          <SocialMediaDisplay
            username={user.telegramusername}
            platform="telegram"
          />
        </td>
      </tr>

      {/* Referral Details Rows */}
      {isExpanded && user.referralCount && user.referralCount > 0 && (
        <>
          {/* Referral Header with Clean Dynamic Pagination */}
          <tr className="border-b border-gray-700/30 bg-gray-800/30">
            <td colSpan={9} className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-[#00FFA9]" />
                  <h4 className="text-lg font-semibold text-white">
                    Referrals ({user.referralCount} total)
                  </h4>
                  {isLoadingReferrals ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin text-[#00FFA9]" />
                      <span className="text-sm text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      Showing {currentReferrals.length} of {user.referralCount}
                    </span>
                  )}
                </div>

                {/* Clean Referral Pagination Controls - No Duplicates */}
                {actualTotalPages > 1 && !isLoadingReferrals && (
                  <div className="flex items-center justify-center lg:justify-end space-x-2 text-sm">
                    <span className="text-gray-400 bg-gray-700 px-3 py-1 rounded">
                      Page {currentRefPage} of {actualTotalPages}
                    </span>

                    {/* Previous Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentRefPage > 1) {
                          handleReferralPageChange(currentRefPage - 1);
                        }
                      }}
                      disabled={currentRefPage === 1}
                      className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>

                    {/* Dynamic Page Numbers - SINGLE SET */}
                    <div className="flex items-center space-x-1">
                      {referralPageNumbers.map((pageNum, index) => {
                        if (pageNum === "...") {
                          return (
                            <span
                              key={`ellipsis-${user.id}-${index}`}
                              className="px-2 py-1 text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }

                        const pageNumber = pageNum as number;
                        return (
                          <button
                            key={`ref-page-${user.id}-${pageNumber}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReferralPageChange(pageNumber);
                            }}
                            className={`px-2 py-1 rounded transition-colors text-xs min-w-[28px] ${
                              currentRefPage === pageNumber
                                ? "bg-[#00FFA9] text-black font-medium"
                                : "bg-gray-700 hover:bg-gray-600 text-white"
                            }`}
                            title={`Go to page ${pageNumber}`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentRefPage < actualTotalPages) {
                          handleReferralPageChange(currentRefPage + 1);
                        }
                      }}
                      disabled={currentRefPage >= actualTotalPages}
                      className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {/* Quick Jump Dropdown for many pages */}
                    {actualTotalPages > 10 && (
                      <select
                        value={currentRefPage}
                        onChange={(e) => {
                          e.stopPropagation();
                          const newPage = parseInt(e.target.value);
                          handleReferralPageChange(newPage);
                        }}
                        className="hidden lg:block bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 hover:bg-gray-600 transition-colors"
                        title="Jump to page"
                      >
                        {Array.from(
                          { length: actualTotalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <option key={`jump-page-${user.id}-${page}`} value={page}>
                            Page {page}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            </td>
          </tr>

          {/* Referral Sub-header */}
          <tr className="border-b border-gray-700/20 bg-gray-800/20">
            <td className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
              Referred User
            </td>
            <td className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
              Rewards
            </td>
            <td className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">
              Social Tasks
            </td>
            <td className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">
              Referral Tasks
            </td>
            <td className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">
              Created
            </td>
            <td className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">
              Instagram
            </td>
            <td className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">
              X
            </td>
            <td className="p-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">
              Telegram
            </td>
            <td className="p-3"></td>
          </tr>

          {/* Individual Referral Rows */}
          {isLoadingReferrals ? (
            <tr className="border-b border-gray-700/30 bg-gray-800/30">
              <td colSpan={9} className="p-6 text-center">
                <div className="flex items-center justify-center space-x-3 text-gray-400 text-sm">
                  <Loader className="w-5 h-5 animate-spin text-[#00FFA9]" />
                  <span>Loading referrals...</span>
                </div>
              </td>
            </tr>
          ) : currentReferrals.length > 0 ? (
            currentReferrals.map((referral, index) => (
              <tr
                key={`referral-${user.id}-${referral.id}-${index}`}
                className="border-b border-gray-700/20 bg-gray-800/10 hover:bg-gray-700/20 transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#00FFA9] rounded-full"></div>
                    <span
                      className="text-white text-sm font-mono break-all lg:break-normal"
                      title={referral.walletAddress}
                    >
                      <span className="hidden lg:inline">{referral.walletAddress}</span>
                      <span className="lg:hidden">
                        {referral.walletAddress.length > 20
                          ? `${referral.walletAddress.slice(0, 6)}...${referral.walletAddress.slice(-6)}`
                          : referral.walletAddress}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3 text-yellow-400" />
                    <span className="text-white text-sm">
                      {referral.rewardEarned}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <TaskStatus
                    completed={referral.socialTasksCompleted}
                    label={referral.socialTasksCompleted ? "Done" : "Pending"}
                  />
                </td>
                <td className="p-3 text-center">
                  <TaskStatus
                    completed={referral.referralTasksCompleted}
                    label={referral.referralTasksCompleted ? "Done" : "Pending"}
                  />
                </td>
                <td className="p-3 text-center">
                  <span className="text-white text-sm">
                    {formatDate(referral.createdAt)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <SocialMediaDisplay
                    username={referral.instagramusername}
                    platform="instagram"
                  />
                </td>
                <td className="p-3 text-center">
                  <SocialMediaDisplay
                    username={referral.xusername}
                    platform="x"
                  />
                </td>
                <td className="p-3 text-center">
                  <SocialMediaDisplay
                    username={referral.telegramusername}
                    platform="telegram"
                  />
                </td>
                <td className="p-3"></td>
              </tr>
            ))
          ) : (
            <tr className="border-b border-gray-700/30 bg-gray-800/30">
              <td colSpan={9} className="p-6 text-center">
                <div className="text-gray-400 text-sm">
                  <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  {user.referralCount
                    ? "No referrals found for this page"
                    : "No referrals found"}
                </div>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
};