import React, { useState } from 'react';
import { Calendar, Pause, Play } from 'lucide-react';

const ClaimControl: React.FC = () => {
  const [claimDate, setClaimDate] = useState('2024-01-15');
  const [claimEnabled, setClaimEnabled] = useState(true);

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Claim Control</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Next Claim Date
          </label>
          <input
            type="date"
            value={claimDate}
            onChange={(e) => setClaimDate(e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
          />
        </div>

        {/* Referral Claims Button */}
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
          <div>
            <h3 className="text-white font-medium">Referral Claims</h3>
            <p className="text-sm text-gray-400">Allow users to claim referral rewards</p>
          </div>
          <button
            onClick={() => setClaimEnabled(!claimEnabled)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              claimEnabled
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            {claimEnabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{claimEnabled ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <h3 className="text-yellow-400 font-medium mb-2">⚠️ Important Notice</h3>
          <p className="text-sm text-yellow-200">
            Disabling claims will prevent all users from withdrawing their referral rewards. 
            Use this feature carefully during maintenance periods.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimControl;