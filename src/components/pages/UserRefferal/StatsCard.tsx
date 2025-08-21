// components/StatsCard.tsx
import React from 'react';
import { Loader } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  loading = false 
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-[#00FFA9]/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-2">
            {loading ? (
              <Loader className="w-6 h-6 animate-spin text-[#00FFA9]" />
            ) : (
              value
            )}
          </p>
        </div>
        <div className="p-3 bg-[#00FFA9]/20 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};