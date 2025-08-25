import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  CheckSquare, 
 
  LogOut,
  Coins,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Users Dashboard', icon: LayoutDashboard },
    { id: 'Token_Reward', label: 'Referral Reward Settings', icon: Gift },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
   
    
   
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when item is selected
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false); // Close mobile menu when logout is clicked
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 lg:hidden p-3 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
  isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
} md:translate-x-0 fixed md:relative z-40 w-80 md:w-16 lg:w-64 xl:w-72 bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 h-full right-0 md:right-auto`}>
      <div className="p-4 md:p-2 lg:p-4 xl:p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3 md:space-x-0 lg:space-x-3 xl:space-x-3">
          <div className="w-10 h-10 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10  flex items-center justify-center">
            <img className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6"  src='./onlyLogo.png'/>
          </div>
          <div className="block md:hidden lg:block">
            <h2 className="text-xl lg:text-lg xl:text-xl font-bold text-white">NowaAdmin</h2>
           
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 md:p-1 lg:p-2 xl:p-4">
        <ul className="space-y-2 md:space-y-1 lg:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 md:justify-center md:space-x-0 lg:justify-start lg:space-x-3  px-4 md:px-2 lg:px-4 py-3 md:py-2 lg:py-3 rounded-xl md:rounded-lg lg:rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00FFA9]/20 to-[#00CC87]/20 text-[#00FFA9] border border-[#00FFA9]/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:hidden lg:inline lg:text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 md:p-1 lg:p-2 xl:p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 md:justify-center md:space-x-0 lg:justify-start lg:space-x-2 xl:space-x-3 px-4 md:px-2 lg:px-3 xl:px-4 py-3 md:py-2 lg:py-2.5 xl:py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl md:rounded-lg lg:rounded-xl transition-all duration-300"
          title="Logout"
        >
          <LogOut className="w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
          <span className="font-medium text-base md:hidden lg:inline lg:text-sm xl:text-base">Logout</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;