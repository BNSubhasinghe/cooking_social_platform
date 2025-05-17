import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRecipes } from "../api/recipeApi";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [toast, setToast] = useState(null);
  const [showTopButton, setShowTopButton] = useState(false);

  const navigate = useNavigate();

  // Enhanced sorting function for case-insensitive alphabetical order
  const sortRecipesAlphabetically = (recipeList) => {
    return [...recipeList].sort((a, b) => 
      a.title.localeCompare(b.title, 'en', { 
        sensitivity: 'base',
        ignorePunctuation: true,
        numeric: true 
      })
    );
  };

  // Fetch recipes from backend and sort alphabetically
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getAllRecipes();
        const sortedRecipes = sortRecipesAlphabetically(response.data);
        setRecipes(sortedRecipes);
        setFiltered(sortedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter recipes based on search and filters
  useEffect(() => {
    let filteredList = [...recipes];
    
    if (search.trim() !== '') {
      filteredList = filteredList.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterCategory !== '') {
      filteredList = filteredList.filter((r) => r.category === filterCategory);
    }
    if (filterCuisine !== '') {
      filteredList = filteredList.filter((r) => r.cuisineType === filterCuisine);
    }
    if (showFavoritesOnly) {
      filteredList = filteredList.filter((r) => favorites.includes(r.id));
    }
    
    // Sort the filtered list alphabetically
    const sortedFilteredList = sortRecipesAlphabetically(filteredList);
    setFiltered(sortedFilteredList);
  }, [search, filterCategory, filterCuisine, showFavoritesOnly, recipes, favorites]);

  // Show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id];
      showToast(prev.includes(id) ? "Removed from favorites" : "Added to favorites");
      return updated;
    });
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">All Recipes</h2>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        >
          <option value="">All Categories</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Vegan">Vegan</option>
          <option value="Dessert">Dessert</option>
          <option value="Drinks">Drinks</option>
          <option value="Soup">Soup</option>
        </select>
        <select
          value={filterCuisine}
          onChange={(e) => setFilterCuisine(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        >
          <option value="">All Cuisines</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
          <option value="Mexican">Mexican</option>
          <option value="Japanese">Japanese</option>
          <option value="SriLankan">SriLankan</option>
        </select>
        <button
          onClick={() => setShowFavoritesOnly(prev => !prev)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${showFavoritesOnly ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          {showFavoritesOnly ? "Show All" : "⭐ Favorites"}
        </button>
      </div>

      {/* Recipe Cards - Now properly sorted A-Z */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                {recipe.mediaUrl ? (
                  <img
                    src={`http://localhost:8080/recipes/image/${recipe.mediaUrl}`}
                    alt={recipe.title}
                    className="w-full h-64 object-cover hover:opacity-90 transition-opacity duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="h-64 w-full bg-gradient-to-r from-gray-100 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image Available</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className={`text-2xl p-2 rounded-full bg-white bg-opacity-80 backdrop-blur-sm shadow-md ${favorites.includes(recipe.id) ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-red-500'} transition-all duration-300`}
                    aria-label={favorites.includes(recipe.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.includes(recipe.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-black bg-opacity-70 text-white text-sm rounded-full">
                    {recipe.cuisineType || "Global"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{recipe.title}</h3>
                  {recipe.averageRating > 0 && (
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                      <span className="text-yellow-500 font-bold mr-1">
                        {parseFloat(recipe.averageRating).toFixed(1)}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-yellow-600 ml-1">
                        ({recipe.ratingCount})
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {recipe.description || "No description available."}
                </p>
                
                <button
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View Recipe
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-600 mt-4">No recipes found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {toast}
        </div>
      )}

      {/* Scroll-to-top Button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RecipeList;