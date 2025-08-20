import React, { useState } from 'react';
import { Search, Filter, Download, Eye, MoreHorizontal } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    {
      id: 1,
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      referralCount: 23,
      earnedAmount: 145.50,
      taskCompletion: 85,
      stakingStatus: 'Active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      referralCount: 8,
      earnedAmount: 42.25,
      taskCompletion: 60,
      stakingStatus: 'Inactive',
      joinDate: '2024-01-18',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      walletAddress: '0x567890abcdef1234567890abcdef1234567890ab',
      referralCount: 156,
      earnedAmount: 892.75,
      taskCompletion: 95,
      stakingStatus: 'Active',
      joinDate: '2023-12-20',
      lastActive: '30 minutes ago'
    },
    {
      id: 4,
      walletAddress: '0xcdef1234567890abcdef1234567890abcdef1234',
      referralCount: 4,
      earnedAmount: 18.00,
      taskCompletion: 40,
      stakingStatus: 'Pending',
      joinDate: '2024-01-20',
      lastActive: '3 hours ago'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.stakingStatus.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Wallet Address,Referral Count,Earned Amount,Task Completion,Staking Status,Join Date\n" +
      users.map(user => 
        `${user.walletAddress},${user.referralCount},${user.earnedAmount},${user.taskCompletion}%,${user.stakingStatus},${user.joinDate}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-2">Monitor and manage user accounts and activities</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00FFA9]/25"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '12,847', color: 'from-blue-500 to-blue-600' },
          { label: 'Active Stakers', value: '8,423', color: 'from-green-500 to-green-600' },
          { label: 'Pending Users', value: '1,244', color: 'from-yellow-500 to-yellow-600' },
          { label: 'Inactive Users', value: '3,180', color: 'from-red-500 to-red-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <div className="w-6 h-6 bg-white/20 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-8 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-6 text-gray-400 font-medium">User</th>
                <th className="text-left p-6 text-gray-400 font-medium">Referrals</th>
                <th className="text-left p-6 text-gray-400 font-medium">Earned</th>
                <th className="text-left p-6 text-gray-400 font-medium">Tasks</th>
                <th className="text-left p-6 text-gray-400 font-medium">Staking</th>
                <th className="text-left p-6 text-gray-400 font-medium">Activity</th>
                <th className="text-left p-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${index % 2 === 0 ? 'bg-gray-800/20' : ''}`}>
                  <td className="p-6">
                    <div>
                      <p className="text-white font-mono text-sm">
                        {user.walletAddress.slice(0, 10)}...{user.walletAddress.slice(-8)}
                      </p>
                      <p className="text-gray-400 text-xs">Joined {user.joinDate}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-white font-semibold">{user.referralCount}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-[#00FFA9] font-semibold">${user.earnedAmount}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] rounded-full transition-all duration-300"
                          style={{ width: `${user.taskCompletion}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm">{user.taskCompletion}%</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(user.stakingStatus)}`}>
                      {user.stakingStatus}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-gray-400 text-sm">{user.lastActive}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-[#00FFA9] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Showing {filteredUsers.length} of {users.length} users</span>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">Previous</button>
          <span className="px-3 py-1 bg-[#00FFA9] text-black rounded">1</span>
          <button className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;