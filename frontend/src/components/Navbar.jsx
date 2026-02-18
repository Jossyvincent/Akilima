import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, FaCloudSun, FaLeaf, FaMoneyBillWave, 
  FaUser, FaSignOutAlt, FaBars, FaTimes 
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/weather', icon: FaCloudSun, label: 'Weather' },
    { path: '/advisories', icon: FaLeaf, label: 'Advisories' },
    { path: '/market-prices', icon: FaMoneyBillWave, label: 'Market Prices' },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-primary-500 font-bold text-xl">
            <FaLeaf className="text-2xl" />
            <span>Akilima</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon />
                {label}
              </Link>
            ))}
          </div>

          {/* User Info & Logout (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <FaUser className="text-primary-600" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{user?.name}</div>
                <div className="text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon />
                {label}
              </Link>
            ))}
            
            {/* Mobile User Info */}
            <div className="pt-4 pb-2 border-t border-gray-200">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-primary-600" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;