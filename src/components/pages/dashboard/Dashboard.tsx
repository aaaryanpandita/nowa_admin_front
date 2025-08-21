import React, { useState } from 'react';
import { Users, DollarSign, AlertCircle } from 'lucide-react';
// Import the real API service instead of mock
import DashboardMetrics from './DashboardMetrics';










const Dashboard: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null);

  const handleError = (error: string) => {
    setNotification(error);
    // Auto-clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const chartData = {
    userGrowth: [
      { date: 'Jan 1', users: 1200 },
      { date: 'Jan 8', users: 1850 },
      { date: 'Jan 15', users: 2400 },
      { date: 'Jan 22', users: 3200 },
      { date: 'Jan 29', users: 4100 },
      { date: 'Feb 5', users: 5200 },
      { date: 'Feb 12', users: 6800 }
    ],
    referralEarnings: [
      { date: 'Jan 1', earnings: 2500 },
      { date: 'Jan 8', earnings: 3200 },
      { date: 'Jan 15', earnings: 4100 },
      { date: 'Jan 22', earnings: 5800 },
      { date: 'Jan 29', earnings: 7200 },
      { date: 'Feb 5', earnings: 9100 },
      { date: 'Feb 12', earnings: 12400 }
    ]
  };

  const maxUsers = Math.max(...chartData.userGrowth.map(d => d.users));
  const maxEarnings = Math.max(...chartData.referralEarnings.map(d => d.earnings));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard & Reports</h1>
            <p className="text-gray-400 mt-2">Track performance and generate insights</p>
          </div>
        </div>

        {/* Error Notification */}
        {notification && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">{notification}</p>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Key Metrics - Now using real API data */}
       <DashboardMetrics onError={handleError} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">User Growth Timeline</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.userGrowth.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:scale-105"
                    style={{ height: `${(data.users / maxUsers) * 200}px` }}
                  ></div>
                  <div className="text-center">
                    <p className="text-xs text-white font-semibold">{data.users}</p>
                    <p className="text-xs text-gray-400 mt-1">{data.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Earnings Chart */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Daily Referral Earnings</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>USD</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.referralEarnings.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-[#00FFA9] to-[#00CC87] rounded-t-lg transition-all duration-500 hover:scale-105"
                    style={{ height: `${(data.earnings / maxEarnings) * 200}px` }}
                  ></div>
                  <div className="text-center">
                    <p className="text-xs text-white font-semibold">${data.earnings}</p>
                    <p className="text-xs text-gray-400 mt-1">{data.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6">Top Referrers</h3>
            <div className="space-y-4">
              {[
                { wallet: '0x1234...5678', referrals: 156, earnings: 892.75 },
                { wallet: '0xabcd...efgh', referrals: 89, earnings: 534.50 },
                { wallet: '0x9876...5432', referrals: 67, earnings: 402.25 },
                { wallet: '0xfedc...ba98', referrals: 45, earnings: 271.50 }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-mono text-sm">{user.wallet}</p>
                      <p className="text-gray-400 text-xs">{user.referrals} referrals</p>
                    </div>
                  </div>
                  <span className="text-[#00FFA9] font-semibold">${user.earnings}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6">Staking Distribution</h3>
            <div className="space-y-4">
              {[
                { status: 'Active Stakers', count: 8423, percentage: 65.6, color: 'bg-green-500' },
                { status: 'Pending Verification', count: 1244, percentage: 9.7, color: 'bg-yellow-500' },
                { status: 'Inactive Users', count: 3180, percentage: 24.7, color: 'bg-gray-500' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{item.status}</span>
                    <div className="text-right">
                      <span className="text-white font-semibold">{item.count.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
              <h4 className="text-white font-medium mb-2">Total Staked Value</h4>
              <p className="text-3xl font-bold text-[#00FFA9]">₿ 1,847.32</p>
              <p className="text-sm text-gray-400 mt-1">≈ $127,843,291 USD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;