import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import DashboardOverview from './pages/DashboardOverview';
import ReferralSettings from './pages/ReferralSettings';
import TaskManagement from './pages/TaskManagement';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'referrals':
        return <ReferralSettings />;
      case 'tasks':
        return <TaskManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;