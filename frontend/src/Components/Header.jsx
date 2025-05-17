import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-full mx-auto flex justify-between items-center px-4 md:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <motion.span 
              className="font-extrabold text-3xl md:text-4xl tracking-tight font-logo"
              style={{ fontFamily: "'Pacifico', cursive" }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">YUMMY</span>
            </motion.span>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-700 p-2 focus:outline-none hover:bg-gray-100 rounded-full"
          >
            {mobileMenuOpen ? 
              <FiX className="w-6 h-6" /> : 
              <FiMenu className="w-6 h-6" />
            }
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 font-medium">
          {[
            { name: "Home", path: "/home" },
            { name: "About", path: "/about" },
            { name: "Challenges", path: "/challenge-landing" },
            { name: "Recipes", path: "/landing-page" },
            { name: "Tips & Tricks", path: "/cookingTips" },
            { name: "Nutrition", path: "/nutrition" }
          ].map((item) => (
            <Link 
              key={item.name}
              to={item.path} 
              className="px-3 py-2 rounded-lg hover:bg-blue-50 transition-all text-gray-700 hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Auth Button (Desktop) */}
        <div className="hidden md:block">
          {user && user.token ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="ml-2 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold shadow-sm"
            >
              Logout
            </motion.button>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="ml-2 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold shadow-sm"
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-50 border-t border-gray-200"
        >
          <div className="px-4 py-2 space-y-1">
            {[
              { name: "Home", path: "/home" },
              { name: "About", path: "/about" },
              { name: "Challenges", path: "/challenge-landing" },
              { name: "Recipes", path: "/landing-page" },
              { name: "Tips & Tricks", path: "/cookingTips" },
              { name: "Nutrition", path: "/nutrition" }
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                onClick={toggleMobileMenu}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Button (Mobile) */}
            <div className="pt-2 pb-3">
              {user && user.token ? (
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={toggleMobileMenu}
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;