import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bus, Map, Ticket, User, LogOut, LogIn, BarChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', path: '/', icon: <Bus className="w-5 h-5" /> },
    { name: 'Routes', path: '/routes', icon: <Map className="w-5 h-5" /> },
    { name: 'Track', path: '/tracking', icon: <Map className="w-5 h-5" /> },
    { name: 'My Tickets', path: '/tickets', icon: <Ticket className="w-5 h-5" />, protected: true },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin', path: '/admin', icon: <BarChart className="w-5 h-5" />, protected: true });
  }

  // Add animation class based on scroll state
  const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white shadow-md py-2' 
      : 'bg-gradient-to-r from-primary-900 to-primary-800 py-4'
  }`;

  // Text color based on scroll state
  const textColor = isScrolled ? 'text-primary-900' : 'text-white';
  
  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bus className={`w-7 h-7 ${textColor}`} />
            <Link 
              to="/" 
              className={`text-xl font-bold ${textColor} transition-colors duration-300`}
            >
              BusTracker
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.protected && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1 ${textColor} hover:text-primary-300 transition-colors duration-300 ${
                    location.pathname === item.path ? 'font-medium border-b-2 border-primary-500' : ''
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <User className={`w-5 h-5 ${textColor}`} />
                  <span className={`font-medium ${textColor}`}>{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition-colors duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${textColor}`} />
            ) : (
              <Menu className={`w-6 h-6 ${textColor}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white rounded-b-lg shadow-lg absolute top-full left-0 right-0 transition-all duration-300">
            <nav className="flex flex-col space-y-4 px-4">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 text-primary-900 hover:text-primary-600 transition-colors duration-300 ${
                      location.pathname === item.path ? 'font-medium' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-primary-900">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;