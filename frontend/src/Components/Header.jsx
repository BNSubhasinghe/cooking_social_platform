import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Challenges', path: '/challenge-landing' },
    { name: 'Recipes', path: '/landing-page' },
    { name: 'Tips & Tricks', path: '/tips-landing' },
    { name: 'Nutrition Tracker', path: '/nutrition' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center z-10">
            <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
              <FaUtensils className="text-xl" />
            </div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-extrabold text-2xl md:text-3xl tracking-tight"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                YUMMY
              </span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:block z-10">
            {user && user.token ? (
              <div className="flex items-center">
                <Link to="/dashboard" className="flex items-center mr-3 text-gray-700 hover:text-blue-600">
                  <FaUserCircle className="mr-1 text-xl" />
                  <span className="font-medium">{user.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/register"
                  className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm font-medium"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-10 p-2 rounded-lg text-gray-700 hover:bg-blue-50 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-2 rounded-lg text-base font-medium ${
                      location.pathname === link.path
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Auth Buttons - Mobile */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {user && user.token ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FaUserCircle className="mr-2" />
                        My Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full mt-2 flex justify-center items-center px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="w-full flex justify-center items-center px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="w-full mt-2 flex justify-center items-center px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;