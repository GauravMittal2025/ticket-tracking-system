import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, User, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: string;
}

const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login, register, isLoading } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const from = locationState?.from || '/';

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      if (isLoginMode) {
        await login(email, password);
        navigate(from);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        await register(name, email, password);
        setSuccess('Registration successful! You can now log in.');
        setIsLoginMode(true);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
  };

  // For demo purposes, show login credentials
  const demoNotice = (
    <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-200">
      <h4 className="text-blue-800 font-medium mb-2">Demo Credentials</h4>
      <p className="text-blue-700 text-sm mb-1">Regular User: <code>user@example.com</code> / <code>password</code></p>
      <p className="text-blue-700 text-sm">Admin User: <code>admin@example.com</code> / <code>admin</code></p>
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">
              {isLoginMode ? 'Sign In to Your Account' : 'Create an Account'}
            </h1>
            <p className="text-gray-600">
              {isLoginMode 
                ? 'Access your bookings and track your trips' 
                : 'Join us to book tickets and track buses in real-time'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            {error && (
              <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-200 flex items-start">
                <AlertCircle className="text-red-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 p-4 rounded-md border border-green-200 flex items-start">
                <CheckCircle className="text-green-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-700">{success}</span>
              </div>
            )}
            
            {isLoginMode && demoNotice}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              
              {!isLoginMode && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              )}
              
              {isLoginMode && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      id="remember" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" 
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                  </span>
                )}
              </button>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-1 text-primary-600 hover:text-primary-500 font-medium"
                >
                  {isLoginMode ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              By signing in or creating an account, you agree to our{' '}
              <Link to="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;