import React, { useState } from 'react';
import { Users, DollarSign, AlertCircle } from 'lucide-react';
// Import the real API service instead of mock
import { apiService } from '../../../services/apiService'; // Adjust path as needed

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color, 
  isLoading 
}) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-24"></div>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-400 text-sm">{title}</p>
        </>
      )}
    </div>
  );
};

interface DashboardMetricsProps {
  onError?: (error: string) => void;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ onError }) => {
  const [dashboardData, setDashboardData] = React.useState({
    totalUsers: 0,
    totalGlobalReward: 0
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getAllUsersWithReferrals();

      if (response.success && response.data) {
        // Destructure the 'result' object
        const { totalUsers, totalGlobalReward } = response.data.result;

        // Set the state with the correct format
        setDashboardData({
          totalUsers,
          totalGlobalReward
        });
       
      } else {
        const errorMessage = response.message || 'Failed to fetch dashboard data';
        console.error('API Error:', errorMessage);
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      console.error('Fetch Error:', err);
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh data every 5 minutes
  React.useEffect(() => {
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate mock percentage changes
  const calculateChange = (current: number, type: 'users' | 'earnings') => {
    const mockPrevious = type === 'users' ? current * 0.89 : current * 1.024;
    const change = ((current - mockPrevious) / mockPrevious) * 100;
    return {
      value: (change >= 0 ? '+' : '') + change.toFixed(1) + '%',
      trend: change >= 0 ? 'up' as const : 'down' as const
    };
  };

  const usersChange = calculateChange(dashboardData.totalUsers, 'users');
  const earningsChange = calculateChange(dashboardData.totalGlobalReward, 'earnings');

  if (error && !isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        <div className="col-span-2 bg-red-900/20 border border-red-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 mb-2">Failed to load dashboard metrics</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ADD THE MISSING RETURN STATEMENT HERE
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
      <MetricCard
        title="Total Users"
        value={dashboardData.totalUsers.toString()}
        change={usersChange.value}
        trend={usersChange.trend}
        icon={Users}
        color="from-blue-500 to-blue-600"
        isLoading={isLoading}
      />

      <MetricCard
        title="Total Referral Amount"
        value={dashboardData.totalGlobalReward.toString()}
        change={earningsChange.value}
        trend={earningsChange.trend}
        icon={DollarSign}
        color="from-purple-500 to-purple-600"
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardMetrics;