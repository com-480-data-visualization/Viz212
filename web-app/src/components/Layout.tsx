import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Navigation items with their paths and labels
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'App Trends' },
    { path: '/profile-generator', label: 'Profile Generator' },
    { path: '/swipe-game', label: 'Swipe Game' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-50 to-pink-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-md fixed w-full z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              LoveLogic
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${location.pathname === item.path
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout; 