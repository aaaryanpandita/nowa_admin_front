// components/auth/LoginScreen.tsx
import React from 'react';
import { Lock } from 'lucide-react';
import LoginForm from './LoginForm';

interface LoginScreenProps {
  onLogin: () => void;
  title?: string;
  subtitle?: string;
  showDemoCredentials?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLogin,
  title = "Admin Portal",
  subtitle = "Access your nowa dashboard",
  showDemoCredentials = true
}) => {
  const handleLoginSuccess = () => {
    // You can add additional success logic here
  
    onLogin();
  };

  const handleLoginError = (error: string) => {
    // You can add additional error handling here
    console.error('Invalid email or password', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA9]/10 via-transparent to-[#00FFA9]/10"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00FFA9]/25">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>

          {/* Login Form */}
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onLoginError={handleLoginError}
            showDemoCredentials={showDemoCredentials}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;