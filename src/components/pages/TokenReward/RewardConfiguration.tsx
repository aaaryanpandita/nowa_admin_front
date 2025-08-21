import React, { useState, useEffect } from 'react';
import { Save, Settings2, Loader2 } from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { toast } from 'react-toastify';

interface RewardConfigurationProps {
  onSaveSuccess?: () => void;
}

const RewardConfiguration: React.FC<RewardConfigurationProps> = ({ onSaveSuccess }) => {
  const [referralReward, setReferralReward] = useState('0');
  const [currentReferralReward, setCurrentReferralReward] = useState('0'); // Renamed for clarity
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingReward, setIsFetchingReward] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
 const [rewardId, setRewardId] = useState<number | undefined>(undefined);



  

  // Fetch the latest referral reward on component mount
  const fetchLatestReferralReward = async () => {
    try {
      setIsFetchingReward(true);
      console.log('🔄 Fetching latest referral reward...');
      
      const response = await apiService.getReferralRewards();
      
      if (response.success && response.result && response.result.length > 0) {
        // Get the latest reward (highest ID)
        const latestReward = response.result[0];
        console.log('💰 Setting referral reward to:', latestReward.refferedreward);
        
        // Update BOTH states - this is the key fix
        setCurrentReferralReward(latestReward.refferedreward.toString());
        setReferralReward(latestReward.refferedreward.toString()); // Update input field too
         setRewardId(latestReward.id); // Save the id!
      } else {
        console.warn('⚠️ No referral reward found, using default value');
        // Keep default value
      }
    } catch (error) {
      console.error('❌ Error fetching latest referral reward:', error);
      // Don't show error toast for initial load, just keep default value
    } finally {
      setIsFetchingReward(false);
    }
  };

  // Fetch latest reward when component mounts
  useEffect(() => {
    fetchLatestReferralReward();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const rewardAmount = parseFloat(referralReward);
      
      if (isNaN(rewardAmount) || rewardAmount <= 0) {
        throw new Error('Please enter a valid reward amount');
      }

     const response = await apiService.addReferralReward(rewardAmount, rewardId);

      if (response.success) {
        toast.success(response.message || 'Referral reward updated successfully!');
        setSuccessMessage('Referral reward updated successfully!');
        
        // Update current reward display after successful save
        setCurrentReferralReward(referralReward);
        
        onSaveSuccess?.();
      } else {
        throw new Error(response.message || 'Failed to update referral reward');
      }
    } catch (error) {
      console.error('❌ Save referral reward error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] rounded-xl flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-xl font-semibold text-white">Reward Configuration</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
           
            disabled={isFetchingReward}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh latest reward"
          >
            
            <span className="hidden sm:inline">Reward: {currentReferralReward}</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={isLoading || isFetchingReward}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00FFA9]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
          <p className="text-green-400 font-medium">✅ {successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <p className="text-red-400 font-medium">❌ {error}</p>
        </div>
      )}

      {/* Loading State for Fetching */}
      {isFetchingReward && (
        <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <p className="text-blue-400 font-medium">Loading latest referral reward...</p>
          </div>
        </div>
      )}
      
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
            min="0.01"
            disabled={isLoading || isFetchingReward}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the amount in USD that users will receive for each referral
          </p>
        </div>

        {/* <div className="pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Current Earning Rules</h3>
          <div className="space-y-3">
            {[
              `Direct referral bonus: $${currentReferralReward} per referral`, // Use currentReferralReward here too
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
        </div> */}
      </div>
    </div>
  );
};

export default RewardConfiguration;