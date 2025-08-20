import React from 'react';
import { Users, Gift, Coins, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '../ui/StatCard';

const DashboardOverview: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    
  
    {
      title: 'Total Referral Amount',
      value: '$127,843',
      change: '-2.4%',
      trend: 'down' as const,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-2">Monitor your referral and staking system performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Last updated</p>
          <p className="text-white font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       

       
      </div>
    </div>
  );
};

export default DashboardOverview;