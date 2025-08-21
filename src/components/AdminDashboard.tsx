import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';

import TokenReward from './pages/TokenReward/TokenReward';
import TaskManagement from './pages/TaskMangement/TaskManagement';
import UserManagement from './pages/UserRefferal/UserManagement';
import Dashboard from './pages/dashboard/Dashboard';


interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      
      case 'Token_Reward':
        return <TokenReward />;
      case 'tasks':
        return <TaskManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Dashboard />;
    
      default:
        return <Dashboard />;
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