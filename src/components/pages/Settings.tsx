import React, { useState } from 'react';
import { Save, Lock, Bell, Shield, Database, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotificationSave = () => {
    alert('Notification settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account and system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Management */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Password Management</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/25"
            >
              <Lock className="w-5 h-5" />
              <span>Update Password</span>
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  emailNotifications ? 'bg-[#00FFA9]' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="text-white font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-400">Browser push notifications</p>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  pushNotifications ? 'bg-[#00FFA9]' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  pushNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </button>
            </div>

            <button
              onClick={handleNotificationSave}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <Save className="w-5 h-5" />
              <span>Save Notifications</span>
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  twoFactorAuth
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                }`}
              >
                {twoFactorAuth ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <h3 className="text-yellow-400 font-medium mb-2">⚠️ Security Recommendations</h3>
              <ul className="text-sm text-yellow-200 space-y-1">
                <li>• Enable two-factor authentication</li>
                <li>• Use a strong, unique password</li>
                <li>• Regularly review login activity</li>
                <li>• Keep your recovery codes safe</li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">System Information</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Version', value: 'v2.1.0' },
              { label: 'Last Updated', value: 'Feb 12, 2024' },
              { label: 'Database Status', value: 'Connected', status: 'success' },
              { label: 'API Status', value: 'Operational', status: 'success' },
              { label: 'Uptime', value: '99.9%', status: 'success' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400">{item.label}</span>
                <div className="flex items-center space-x-2">
                  {item.status && (
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  )}
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;