import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-black text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">Cooking Social Platform</Link>
        </h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/challenge-landing" className="hover:underline">Challenges</Link>
          <Link to="/landing-page" className="hover:underline">Recipes</Link>
          <Link to="/cookingTips" className="hover:underline">CookingTips</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
