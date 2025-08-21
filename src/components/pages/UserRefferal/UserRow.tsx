// components/UserRow.tsx
import React from 'react';
import { ChevronDown, ChevronRight, Users, Award, Search, Filter, Download, Check, X } from 'lucide-react';
import { User } from './types/userTypes';

interface UserRowProps {
    user: User;
    onToggleExpand: (userId: number) => void;
    isExpanded: boolean;
}

export const UserRow: React.FC<UserRowProps> = ({
    user,
    onToggleExpand,
    isExpanded
}) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'not_eligible': return 'bg-red-500/20 text-red-400';
            case 'none': return 'bg-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

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
                               
                                {user.socialTasksCompleted && !user.referralTasksCompleted && (
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                        Social Complete
                                    </span>
                                )}
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
            {isExpanded && user.referrals && user.referrals.length > 0 && (
                user.referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-gray-700/30 bg-gray-800/30">
                        <td className="p-6 pl-16">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-[#00FFA9] rounded-full"></div>
                                <div>
                                    <p className="text-gray-300 font-medium" title={referral.walletAddress}>
                                        {formatAddress(referral.walletAddress)}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        {referral.hasCompletedBoth && (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">

                                            </span>
                                        )}
                                        {referral.socialTasksCompleted && !referral.referralTasksCompleted && (
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">

                                            </span>
                                        )}
                                        {!referral.socialTasksCompleted && referral.referralTasksCompleted && (
                                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">

                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-6">
                            <span className="text-gray-400 text-sm flex items-center space-x-1">
                                <span>Referred User</span>
                                {referral.hasCompletedBoth && (
                                    <span className="text-green-400">✓</span>
                                )}
                            </span>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="text-gray-300 font-medium">{referral.rewardEarned}</span>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="space-y-2">
                                <div className={`text-sm ${user.socialTasksCompleted ? 'text-green-400' : 'text-red-400'}`}>
                                    {referral.socialTasksCompleted ? 'Completed' : 'Not Completed'}
                                </div>

                            </div>
                        </td>
                        <td className="p-6">
                            <div className="space-y-2">
                                <div className={`text-sm ${user.referralTasksCompleted ? 'text-green-400' : 'text-red-400'}`}>
                                    {referral.referralTasksCompleted ? 'Completed' : 'Not Completed'}
                                </div>

                            </div>
                        </td>
                    </tr>
                ))
            )}

            {/* Empty referrals state */}
            {isExpanded && user.referralCount && user.referralCount > 0 && (!user.referrals || user.referrals.length === 0) && (
                <tr className="border-b border-gray-700/30 bg-gray-800/30">
                    <td colSpan={4} className="p-6 pl-16 text-center">
                        <div className="text-gray-400 text-sm">
                            <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                            No referral details available
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

// SearchAndFilter Component (keeping the same but removing unused props)
interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onExport?: () => void;
    onFilter?: () => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchTerm,
    onSearchChange,
    onExport,
    onFilter
}) => {
    return (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by wallet address..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onFilter}
                        className="bg-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-600 transition-colors flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button
                        onClick={onExport}
                        className="bg-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-600 transition-colors flex items-center space-x-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>
        </div>
    );
};