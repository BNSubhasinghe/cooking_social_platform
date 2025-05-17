import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-[#b2e6f7] text-black shadow-md sticky top-0 z-50">
      <div className="max-w-full mx-auto flex justify-between items-center px-8 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <span className="font-extrabold text-4xl tracking-tight font-logo" style={{ fontFamily: "'Pacifico', cursive" }}>
              YUMMY
            </span>
          </Link>
        </div>
        {/* Navigation */}
        <nav className="flex items-center space-x-8 font-semibold text-lg">
          <Link to="/" className="hover:underline hover:text-blue-700 transition">Home</Link>
          {user && user.token && (
            <Link to="/challenge-landing" className="hover:underline hover:text-blue-700 transition">Challenges</Link>
          )}
          <Link to="/landing-page" className="hover:underline hover:text-blue-700 transition">Recipes</Link>
          <Link to="/cookingTips" className="hover:underline hover:text-blue-700 transition">Tips & Tricks</Link>
          <Link to="/nutrition" className="hover:underline hover:text-blue-700 transition">Nutrition Tracker</Link>
        </nav>
        {user && user.token ? (
          <button
            onClick={logout}
            className="ml-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition font-semibold"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="ml-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;