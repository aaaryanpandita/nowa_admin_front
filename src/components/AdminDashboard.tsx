import React from "react";
import Sidebar from "./layout/Sidebar";

import TokenReward from "./pages/TokenReward/TokenReward";
import TaskManagement from "./pages/TaskMangement/TaskManagement";
import { useNavigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";

interface AdminDashboardProps {
  onLogout: () => void;
  activeTab?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  activeTab = "dashboard",
}) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    const routes = {
      dashboard: "/dashboard",
      Token_Reward: "/token-rewards",
      tasks: "/tasks",
      analytics: "/analytics",
    } as const;
    navigate(routes[tab as keyof typeof routes] || "/dashboard");
  };

  // Add this renderContent function
  const renderContent = () => {
    switch (activeTab) {
      case "Token_Reward":
        return <TokenReward />;
      case "tasks":
        return <TaskManagement />;
      case "analytics":
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  // Add this return statement
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange} // Pass handleTabChange instead of setActiveTab
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
