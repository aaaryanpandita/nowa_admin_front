// UserCard.tsx - Mobile-optimized card layout for UserManagement
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
  Calendar,
  
  User as UserIcon,
} from "lucide-react";
import { User } from "./types/userTypes";
import { CopyButton } from './CopyButton';


interface UserCardProps {
  user: User;
  onToggleExpand: (userId: number) => void;
  isExpanded: boolean;
  referralsPerPage?: number;
  currentRefPage?: number;
  onRefPageChange?: (userId: number, page: number) => void;
  totalReferralPages?: number;
  isLoadingReferrals?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
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
        className={`flex items-center justify-center w-4 h-4 rounded-full ${
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

  const displayName = username.length > 12 ? `${username.slice(0, 10)}...` : username;

  return (
    <div className="flex items-center space-x-1 group">
      <div className={getPlatformColor()}>{getIcon()}</div>
      <span 
        className="text-white text-xs font-mono break-all max-w-[100px] sm:max-w-none truncate" 
        title={`@${username}`}
      >
        @{displayName}
      </span>
      <CopyButton text={username} size="sm" className="opacity-0 group-hover:opacity-100" />
    </div>
  );
};

  // Fixed: Handle optional date string with proper type checking
  const formatDate = (dateString?: string): string => {
    if (!dateString || dateString.trim() === "") return "-";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleCardClick = () => {
    if (user.referralCount && user.referralCount > 0) {
      onToggleExpand(user.id);
    }
  };

  const handleReferralPageChange = (page: number) => {
    if (onRefPageChange) {
      onRefPageChange(user.id, page);
    }
  };

  // Calculate total referral pages
  const calculatedTotalPages = user.referralCount
    ? Math.ceil(user.referralCount / referralsPerPage)
    : 0;
  const actualTotalPages = totalReferralPages || calculatedTotalPages;

  const currentReferrals = user.referrals || [];

  // Generate page numbers for referral pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; // Fewer on mobile

    if (actualTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= actualTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentRefPage <= 2) {
        pages.push(1, 2, 3);
        if (actualTotalPages > 3) {
          pages.push("...", actualTotalPages);
        }
      } else if (currentRefPage >= actualTotalPages - 1) {
        pages.push(1, "...", actualTotalPages - 2, actualTotalPages - 1, actualTotalPages);
      } else {
        pages.push(1, "...", currentRefPage, "...", actualTotalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="border-b border-gray-700/50 last:border-b-0">
      {/* Main User Card */}
      <div
        className={`p-4 transition-colors ${
          user.referralCount && user.referralCount > 0
            ? "hover:bg-gray-700/30 cursor-pointer"
            : "hover:bg-gray-700/10"
        }`}
        onClick={handleCardClick}
      >
        {/* User Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {user.referralCount && user.referralCount > 0 ? (
              <div className="text-gray-400 transition-colors">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            ) : (
              <div className="w-4 h-4 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium font-mono text-sm break-all" title={user.walletAddress}>
                {user.walletAddress}
              </p>
               <CopyButton text={user.walletAddress} size="sm" />
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {!user.socialTasksCompleted && user.referralTasksCompleted && (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                    Referral Complete
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Referrals */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-[#00FFA9]" />
              <span className="text-xs text-gray-400">Referrals</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{user.referralCount || 0}</span>
              {user.referralCount && user.referralCount > 0 && (
                <span className="text-xs text-gray-500">
                  ({user.referrals?.filter((r) => r.hasCompletedBoth).length || 0} qualified)
                </span>
              )}
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Rewards</span>
            </div>
            <span className="text-white font-medium">{user.rewardEarned}</span>
          </div>
        </div>

        {/* Task Status */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-2">Social Tasks</div>
            <TaskStatus
              completed={user.socialTasksCompleted}
              label={user.socialTasksCompleted ? "Completed" : "Pending"}
            />
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-2">Referral Tasks</div>
            <TaskStatus
              completed={user.referralTasksCompleted}
              label={user.referralTasksCompleted ? "Completed" : "Pending"}
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-2">Social Media</div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Instagram:</span>
              <SocialMediaDisplay username={user.instagramusername} platform="instagram" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">X:</span>
              <SocialMediaDisplay username={user.xusername} platform="x" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Telegram:</span>
              <SocialMediaDisplay username={user.telegramusername} platform="telegram" />
            </div>
          </div>
        </div>
      </div>

      {/* Referral Details */}
      {isExpanded && user.referralCount && user.referralCount > 0 && (
        <div className="bg-gray-800/30 px-4 pb-4">
          {/* Referral Header */}
          <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#00FFA9]" />
              <h4 className="text-sm font-semibold text-white">
                Referrals ({user.referralCount} total)
              </h4>
              {isLoadingReferrals && (
                <Loader className="w-4 h-4 animate-spin text-[#00FFA9]" />
              )}
            </div>
            {!isLoadingReferrals && (
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                Page {currentRefPage} of {actualTotalPages}
              </span>
            )}
          </div>

          {/* Referral Pagination */}
          {actualTotalPages > 1 && !isLoadingReferrals && (
            <div className="flex items-center justify-center space-x-2 py-3">
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentRefPage > 1) {
                    handleReferralPageChange(currentRefPage - 1);
                  }
                }}
                disabled={currentRefPage === 1}
                className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {pageNumbers.map((pageNum, index) => {
                  if (pageNum === "...") {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400 text-sm">
                        ...
                      </span>
                    );
                  }

                  const pageNumber = pageNum as number;
                  return (
                    <button
                      key={`ref-page-${pageNumber}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReferralPageChange(pageNumber);
                      }}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentRefPage === pageNumber
                          ? "bg-[#00FFA9] text-black font-medium"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
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
                className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Referral List */}
          <div className="space-y-3">
            {isLoadingReferrals ? (
              <div className="text-center py-6">
                <div className="flex items-center justify-center space-x-3 text-gray-400 text-sm">
                  <Loader className="w-4 h-4 animate-spin text-[#00FFA9]" />
                  <span>Loading referrals...</span>
                </div>
              </div>
            ) : currentReferrals.length > 0 ? (
              currentReferrals.map((referral, index) => (
                <div
                  key={`${referral.id}-${index}`}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30"
                >
                  {/* Referral Header */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-[#00FFA9] rounded-full"></div>
                    <span className="text-white text-sm font-mono break-all" title={referral.walletAddress}>
                      {referral.walletAddress}
                    </span>
                  </div>

                  {/* Referral Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center space-x-1">
                      <Award className="w-3 h-3 text-yellow-400" />
                      <span className="text-white text-xs">{referral.rewardEarned}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400 text-xs">{formatDate(referral.createdAt)}</span>
                    </div>
                  </div>

                  {/* Task Status */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <TaskStatus
                      completed={referral.socialTasksCompleted}
                      label="Social"
                    />
                    <TaskStatus
                      completed={referral.referralTasksCompleted}
                      label="Referral"
                    />
                  </div>

                  {/* Social Media */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">IG:</span>
                      <SocialMediaDisplay username={referral.instagramusername} platform="instagram" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">X:</span>
                      <SocialMediaDisplay username={referral.xusername} platform="x" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">TG:</span>
                      <SocialMediaDisplay username={referral.telegramusername} platform="telegram" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 text-sm">
                  <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  {user.referralCount
                    ? "No referrals found for this page"
                    : "No referrals found"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};