import { useEffect, useState } from 'react';
import { getAllTips, getTipOfTheDay, searchTips, getFeaturedTips, getTipsByCategory, rateTip, deleteTip, updateTip, getUserRating } from '../api/cookingTipsApi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import tipBg from '../assets/Tip.jpg';

const CookingTips = () => {
  const [tips, setTips] = useState([]);
  const [tipOfDay, setTipOfDay] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredTips, setFilteredTips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredTips, setFeaturedTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editLoading, setEditLoading] = useState(null);
  const [editingTip, setEditingTip] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'Storage'
  });
  const [ratingLoading, setRatingLoading] = useState(null);
  const [ratingSuccess, setRatingSuccess] = useState(null);
  const [hoverRating, setHoverRating] = useState({});
  const [userRatings, setUserRatings] = useState({});

  const tempUserId = localStorage.getItem('tempUserId') || 
    Math.random().toString(36).substring(7);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [tipsRes, featuredRes] = await Promise.all([
          getAllTips(),
          getFeaturedTips(),
        ]);
        setTips(tipsRes.data);
        setFilteredTips(tipsRes.data);
        setFeaturedTips(featuredRes.data);
        
        // Load user ratings for all tips
        if (tipsRes.data && tipsRes.data.length > 0) {
          await loadUserRatings(tipsRes.data);
          
          // Find the highest rated tip only if there are tips
          const highestRatedTip = tipsRes.data.reduce((prev, current) => {
            return (prev.averageRating > current.averageRating) ? prev : current;
          }, tipsRes.data[0]); // Provide initial value
          setTipOfDay(highestRatedTip);
        } else {
          setTipOfDay(null);
        }
      } catch (err) {
        console.error('Failed to fetch tips:', err);
        setTips([]);
        setFilteredTips([]);
        setFeaturedTips([]);
        setTipOfDay(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Save temporary user ID
    if (!localStorage.getItem('tempUserId')) {
      localStorage.setItem('tempUserId', tempUserId);
    }
  }, [tempUserId]);

  const loadUserRatings = async (tips) => {
    try {
      const ratingPromises = tips.map(tip => 
        getUserRating(tip.id, tempUserId)
          .then(response => ({
            tipId: tip.id,
            rating: response.data
          }))
          .catch(() => ({
            tipId: tip.id,
            rating: null
          }))
      );
      
      const ratings = await Promise.all(ratingPromises);
      const ratingsMap = {};
      ratings.forEach(({ tipId, rating }) => {
        if (rating !== null) {
          ratingsMap[tipId] = rating;
        }
      });
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Failed to load user ratings:', error);
      setUserRatings({});
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query) {
      setFilteredTips(tips);
    } else {
      try {
        const res = await searchTips(query);
        setFilteredTips(res.data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredTips(tips);
    } else {
      try {
        const res = await getTipsByCategory(category);
        setFilteredTips(res.data);
      } catch (err) {
        console.error('Category filter failed:', err);
      }
    }
  };

  const handleRate = async (id, rating) => {
    try {
      setRatingLoading(id);
      await rateTip(id, rating, tempUserId);
      setRatingSuccess(id);
      
      // Update local user ratings
      setUserRatings(prev => ({
        ...prev,
        [id]: rating
      }));

      // Refresh tips after rating
      const updatedTips = await getAllTips();
      setTips(updatedTips.data);
      setFilteredTips(updatedTips.data);
      
      setTimeout(() => {
        setRatingSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Rating failed:', err);
      alert('Failed to rate tip. Please try again.');
    } finally {
      setRatingLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tip?')) {
      try {
        setDeleteLoading(id);
        await deleteTip(id);
        // Refresh tips after deletion
        const updatedTips = await getAllTips();
        setTips(updatedTips.data);
        setFilteredTips(updatedTips.data);
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete tip. Please try again.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleEdit = (tip) => {
    setEditingTip(tip);
    setEditForm({
      title: tip.title,
      description: tip.description,
      category: tip.category
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTip) return;

    try {
      setEditLoading(true);
      await updateTip(editingTip.id, editForm);
      // Refresh tips after update
      const updatedTips = await getAllTips();
      setTips(updatedTips.data);
      setFilteredTips(updatedTips.data);
      setEditingTip(null);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update tip. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const categoryColors = {
    Storage: 'bg-blue-200 text-blue-800',
    Prep: 'bg-green-200 text-green-800',
    Substitutes: 'bg-yellow-200 text-yellow-800',
  };

  const renderStars = (tip, isTipOfDay = false) => {
    const currentHover = hoverRating[tip.id] || 0;
    const userRating = userRatings[tip.id];
    const displayRating = currentHover || userRating || Math.round(tip.averageRating);

    return (
      <div className="flex space-x-1 relative">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            <button
              onClick={() => handleRate(tip.id, star)}
              onMouseEnter={() => setHoverRating((prev) => ({ ...prev, [tip.id]: star }))}
              onMouseLeave={() => setHoverRating((prev) => ({ ...prev, [tip.id]: 0 }))}
              disabled={ratingLoading === tip.id}
              className={`text-2xl transition-colors ${
                ratingLoading === tip.id
                  ? 'text-gray-300 cursor-not-allowed'
                  : (displayRating >= star 
                    ? (userRating === star ? 'text-yellow-500' : 'text-yellow-400')
                    : 'text-gray-400 hover:text-yellow-500')
              }`}
              title={userRating ? `Your rating: ${userRating} stars` : `Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
            {/* Tooltip only for this star and this tip */}
            {hoverRating[tip.id] === star && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                Rate {star} {star === 1 ? 'star' : 'stars'}
              </div>
            )}
          </div>
        ))}
        {userRating && (
          <span className="text-xs text-gray-500 ml-2">(Your rating)</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-900 bg-cover bg-center py-10 px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url(${tipBg})`,
        backgroundAttachment: "fixed"
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🍳 Cooking Tips & Hacks</h1>
          <Link
            to="/addtip"
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition font-semibold shadow"
          >
            Share Your Tip
          </Link>
        </div>

        {/* Tip of the Day */}
        {tipOfDay && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-amber-100 border-l-4 border-amber-500 p-6 mb-8 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">Tip of the Day</h2>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600 font-medium">⭐ {Math.round(tipOfDay.averageRating)}</span>
                <span className="text-gray-500">({tipOfDay.ratingCount} ratings)</span>
              </div>
            </div>
            <p className="text-lg mb-4">{tipOfDay.description}</p>
            <div className="flex items-center justify-between">
              <div className={`inline-block px-3 py-1 text-sm rounded-full ${categoryColors[tipOfDay.category]}`}>
                {tipOfDay.category}
              </div>
              {renderStars(tipOfDay, true)}
            </div>
          </motion.div>
        )}

        {/* Featured Tips Section */}
        {featuredTips.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">✨ Featured Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredTips.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-4 rounded-lg shadow-md border border-amber-200"
                >
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-gray-600 mb-2">{tip.description}</p>
                  <div className={`inline-block px-2 py-1 text-sm rounded-full ${categoryColors[tip.category]}`}>
                    {tip.category}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search cooking tips..."
            value={search}
            onChange={handleSearch}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {['Storage', 'Prep', 'Substitutes'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.length > 0 ? (
            filteredTips.map((tip) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6 transition hover:shadow-2xl relative"
              >
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(tip)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit tip"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(tip.id)}
                    disabled={deleteLoading === tip.id}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete tip"
                  >
                    {deleteLoading === tip.id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>

                <h3 className="text-xl font-semibold mb-3 pr-16">{tip.title}</h3>
                <p className="text-gray-700 mb-4">{tip.description}</p>
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm px-3 py-1 rounded-full ${categoryColors[tip.category]}`}>
                      {tip.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600 font-medium">⭐ {Math.round(tip.averageRating)}</span>
                      <span className="text-gray-500 text-sm">({tip.ratingCount})</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      {renderStars(tip)}
                      {tip.featured && (
                        <span className="text-amber-500 text-sm">✨ Featured</span>
                      )}
                    </div>
                    {ratingLoading === tip.id && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating rating...
                      </div>
                    )}
                    {ratingSuccess === tip.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600"
                      >
                        Rating updated successfully!
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">No tips found.</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Edit Tip</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Storage">Storage</option>
                  <option value="Prep">Prep</option>
                  <option value="Substitutes">Substitutes</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingTip(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 ${
                    editLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {editLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Tip'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CookingTips;
