import React from 'react';
import RewardConfiguration from './RewardConfiguration';
// import ClaimControl from './ClaimControl';

const TokenReward: React.FC = () => {
  const handleRewardSaveSuccess = () => {
    console.log('✅ Referral reward updated successfully');
   
  };

  return (
  <div className="space-y-6">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl sm:text-2xl font-bold text-white">Referral Settings</h1>
      <p className="text-gray-400 mt-2 text-sm sm:text-base">
        Configure referral rewards and claim settings
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
    {/* Reward Configuration Component */}
    <RewardConfiguration onSaveSuccess={handleRewardSaveSuccess} />

    {/* Claim Control Component */}
    {/* <ClaimControl /> */}
  </div>
</div>

  );
};

export default TokenReward;