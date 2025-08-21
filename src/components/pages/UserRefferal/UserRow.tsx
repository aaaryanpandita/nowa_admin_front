// Enhanced UserRow.tsx - Dynamic Referral Pagination
import React from 'react';
import { ChevronDown, ChevronRight, Users, Award,  Check, X, ChevronLeft } from 'lucide-react';
import { User } from './types/userTypes';

interface UserRowProps {
    user: User;
    onToggleExpand: (userId: number) => void;
    isExpanded: boolean;
    referralsPerPage?: number;
    currentRefPage?: number;
    onRefPageChange?: (userId: number, page: number) => void;
    totalReferralPages?: number;
}

export const UserRow: React.FC<UserRowProps> = ({
    user,
    onToggleExpand,
    isExpanded,
    referralsPerPage = 10,
    currentRefPage = 1,
    onRefPageChange,
    totalReferralPages = 0
}) => {
  

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const TaskStatus: React.FC<{ completed: boolean; label: string }> = ({ completed, label }) => (
        <div className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-5 h-5 rounded-full ${completed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                {completed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
            <span className={`text-sm ${completed ? 'text-green-400' : 'text-red-400'}`}>
                {label}
            </span>
        </div>
    );

    const handleRowClick = () => {
        if (user.referralCount && user.referralCount > 0) {
            onToggleExpand(user.id);
        }
    };

    const handleReferralPageChange = (page: number) => {
        if (onRefPageChange) {
            console.log(`🔄 Changing referral page for user ${user.id} to page ${page}`);
            onRefPageChange(user.id, page);
        }
    };

    // Calculate total referral pages from the user's referral count
    const calculatedTotalPages = user.referralCount ? Math.ceil(user.referralCount / referralsPerPage) : 0;
    const actualTotalPages = totalReferralPages || calculatedTotalPages;
    
    const currentReferrals = user.referrals || [];

    // Generate dynamic page numbers for referral pagination
    const generatePageNumbers = () => {
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
                    pages.push('...', actualTotalPages);
                } else {
                    pages.push(5);
                }
            } else if (currentRefPage >= actualTotalPages - 2) {
                // Show first page + last few pages
                pages.push(1, '...', actualTotalPages - 3, actualTotalPages - 2, actualTotalPages - 1, actualTotalPages);
            } else {
                // Show first + current range + last
                pages.push(1, '...', currentRefPage - 1, currentRefPage, currentRefPage + 1, '...', actualTotalPages);
            }
        }
        
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <>
            {/* Main User Row */}
            <tr
                className={`border-b border-gray-700/50 transition-colors ${user.referralCount && user.referralCount > 0
                        ? 'hover:bg-gray-700/30 cursor-pointer'
                        : 'hover:bg-gray-700/10'
                    }`}
                onClick={handleRowClick}
            >
                <td className="p-6">
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
                        <div>
                            <p className="text-white font-medium" title={user.walletAddress}>
                                {formatAddress(user.walletAddress)}
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
                <td className="p-6">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-[#00FFA9]" />
                        <span className="text-white font-medium">{user.referralCount || 0}</span>
                        {user.referralCount && user.referralCount > 0 && (
                            <span className="text-xs text-gray-400">
                                ({user.referrals?.filter(r => r.hasCompletedBoth).length || 0} qualified)
                            </span>
                        )}
                    </div>
                </td>
                <td className="p-6">
                    <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">{user.rewardEarned}</span>
                    </div>
                </td>
                <td className="p-6">
                    <div className="space-y-2">
                        <div className={`text-sm ${user.socialTasksCompleted ? 'text-green-400' : 'text-red-400'}`}>
                            {user.socialTasksCompleted ? 'Completed' : 'Not Completed'}
                        </div>
                    </div>
                </td>
                <td className="p-6">
                    <div className="space-y-2">
                        <div className={`text-sm ${user.referralTasksCompleted ? 'text-green-400' : 'text-red-400'}`}>
                            {user.referralTasksCompleted ? 'Completed' : 'Not Completed'}
                        </div>
                    </div>
                </td>
            </tr>

            {/* Referral Details Rows */}
            {isExpanded && user.referralCount && user.referralCount > 0 && (
                <>
                    {/* Referral Header with Enhanced Dynamic Pagination */}
                    <tr className="border-b border-gray-700/30 bg-gray-800/30">
                        <td colSpan={5} className="p-4 pl-16">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Users className="w-5 h-5 text-[#00FFA9]" />
                                    <h4 className="text-lg font-semibold text-white">
                                        Referrals ({user.referralCount} total)
                                    </h4>
                                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                        Showing {currentReferrals.length} of {user.referralCount}
                                    </span>
                                </div>
                                
                                {/* Enhanced Dynamic Referral Pagination Controls */}
                                {actualTotalPages > 1 && (
                                    <div className="flex items-center space-x-2 text-sm">
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
                                        
                                        {/* Dynamic Page Numbers */}
                                        <div className="flex items-center space-x-1">
                                            {pageNumbers.map((pageNum, index) => {
                                                if (pageNum === '...') {
                                                    return (
                                                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
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
                                                        className={`px-2 py-1 rounded transition-colors text-xs min-w-[28px] ${
                                                            currentRefPage === pageNumber
                                                                ? 'bg-[#00FFA9] text-black font-medium'
                                                                : 'bg-gray-700 hover:bg-gray-600 text-white'
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
                                        
                                        {/* Quick Jump Dropdown (Optional) */}
                                        {actualTotalPages > 10 && (
                                            <select
                                                value={currentRefPage}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    const newPage = parseInt(e.target.value);
                                                    handleReferralPageChange(newPage);
                                                }}
                                                className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 hover:bg-gray-600 transition-colors"
                                                title="Jump to page"
                                            >
                                                {Array.from({ length: actualTotalPages }, (_, i) => i + 1).map(page => (
                                                    <option key={page} value={page}>
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
                        <td className="p-3 pl-20 text-xs font-medium text-gray-400 uppercase tracking-wide">
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
                    </tr>

                    {/* Individual Referral Rows */}
                    {currentReferrals.length > 0 ? (
                        currentReferrals.map((referral, index) => (
                            <tr
                                key={`${referral.id}-${index}`}
                                className="border-b border-gray-700/20 bg-gray-800/10 hover:bg-gray-700/20 transition-colors"
                            >
                                <td className="p-3 pl-20">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-[#00FFA9] rounded-full"></div>
                                        <span 
                                            className="text-white text-sm font-mono"
                                            title={referral.walletAddress}
                                        >
                                            {formatAddress(referral.walletAddress)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            #{((currentRefPage - 1) * referralsPerPage) + index + 1}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-1">
                                        <Award className="w-3 h-3 text-yellow-400" />
                                        <span className="text-white text-sm">{referral.rewardEarned}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center">
                                    <TaskStatus
                                        completed={referral.socialTasksCompleted}
                                        label={referral.socialTasksCompleted ? 'Done' : 'Pending'}
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <TaskStatus
                                        completed={referral.referralTasksCompleted}
                                        label={referral.referralTasksCompleted ? 'Done' : 'Pending'}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="border-b border-gray-700/30 bg-gray-800/30">
                            <td colSpan={4} className="p-6 pl-20 text-center">
                                <div className="text-gray-400 text-sm">
                                    <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                    {user.referralCount ? 'Loading referral details...' : 'No referrals found'}
                                </div>
                            </td>
                        </tr>
                    )}
                </>
            )}
        </>
    );
};