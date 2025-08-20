import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@cryptoadmin.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation - in production, this would be a real API call
    if (email === 'admin@cryptoadmin.com' && password === 'admin123') {
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        alert('Invalid credentials. Use: admin@cryptoadmin.com / admin123');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA9]/10 via-transparent to-[#00FFA9]/10"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00FFA9]/25">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Access your crypto dashboard</p>
            
            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-[#00FFA9]/10 border border-[#00FFA9]/20 rounded-xl">
              <p className="text-sm text-[#00FFA9] font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-gray-300">Email: admin@cryptoadmin.com</p>
              <p className="text-xs text-gray-300">Password: admin123</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                  placeholder="Email or Username"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00FFA9] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400">
                <input type="checkbox" className="mr-2 accent-[#00FFA9]" />
                Remember me
              </label>
              <a href="#" className="text-[#00FFA9] hover:text-[#00CC87] transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00FFA9] to-[#00CC87] text-black font-semibold py-3 px-6 rounded-xl shadow-lg shadow-[#00FFA9]/25 hover:shadow-[#00FFA9]/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;