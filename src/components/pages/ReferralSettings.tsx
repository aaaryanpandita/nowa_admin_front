import React, { useState } from 'react';
import { Save, Calendar, Pause, Play, Settings2 } from 'lucide-react';

const ReferralSettings: React.FC = () => {
  const [referralReward, setReferralReward] = useState('5.00');
  const [claimDate, setClaimDate] = useState('2024-01-15');
  const [claimEnabled, setClaimEnabled] = useState(true);
  const [minReferrals, setMinReferrals] = useState('5');
  const [maxEarnings, setMaxEarnings] = useState('100.00');

  const handleSave = () => {
    // Handle save logic
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Referral Settings</h1>
          <p className="text-gray-400 mt-2">Configure referral rewards and claim settings</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00FFA9]/25"
        >
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reward Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] rounded-xl flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-xl font-semibold text-white">Reward Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Referral Reward Amount (USD)
              </label>
              <input
                type="number"
                value={referralReward}
                onChange={(e) => setReferralReward(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                placeholder="5.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Referrals Required
              </label>
              <input
                type="number"
                value={minReferrals}
                onChange={(e) => setMinReferrals(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Daily Earnings (USD)
              </label>
              <input
                type="number"
                value={maxEarnings}
                onChange={(e) => setMaxEarnings(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                placeholder="100.00"
                step="0.01"
              />
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Earning Rules</h3>
              <div className="space-y-3">
                {[
                  'Direct referral bonus: $5.00 per referral',
                  'Tier 2 referral bonus: $2.50 per referral',
                  'Tier 3 referral bonus: $1.00 per referral',
                  'Minimum withdrawal: $20.00'
                ].map((rule, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-[#00FFA9] rounded-full"></div>
                    <span className="text-gray-300">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Claim Control */}
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

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <h3 className="text-yellow-400 font-medium mb-2">⚠️ Important Notice</h3>
              <p className="text-sm text-yellow-200">
                Disabling claims will prevent all users from withdrawing their referral rewards. 
                Use this feature carefully during maintenance periods.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-medium">Claim Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-[#00FFA9]">247</p>
                  <p className="text-sm text-gray-400">Pending Claims</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">1,834</p>
                  <p className="text-sm text-gray-400">Processed Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSettings;