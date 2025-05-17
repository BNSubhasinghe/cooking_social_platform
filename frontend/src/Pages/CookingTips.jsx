import { useEffect, useState } from 'react';
import { getAllTips, getTipOfTheDay, searchTips, getFeaturedTips, getTipsByCategory, rateTip, deleteTip, updateTip, getUserRating, getMyTips, getTipComments, addTipComment, updateTipComment, deleteTipComment } from '../api/cookingTipsApi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import tipBg from '../assets/Tip.jpg';
import { format } from 'date-fns';
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

if (!localStorage.getItem('tempUserId')) {
  localStorage.setItem('tempUserId', crypto.randomUUID());
}
const loggedInUserId = localStorage.getItem('userId'); // Set this on login!
const tempUserId = localStorage.getItem('tempUserId');
const currentUserId = loggedInUserId || tempUserId;

const CookingTips = () => {
  const [tips, setTips] = useState([]);
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
  const [showMyTips, setShowMyTips] = useState(false); // Add toggle for my tips
  const [selectedTip, setSelectedTip] = useState(null);
  // Review section state
  const [tipUserRating, setTipUserRating] = useState(0);
  const [tipHoverRating, setTipHoverRating] = useState(0);
  const [tipReviewText, setTipReviewText] = useState('');
  const [tipReviewUserName, setTipReviewUserName] = useState('');
  const [tipReviews, setTipReviews] = useState([]);
  const [tipComments, setTipComments] = useState([]);
  const [tipCommentText, setTipCommentText] = useState('');
  const [tipCommentUserName, setTipCommentUserName] = useState('');
  const [tipCommentRating, setTipCommentRating] = useState(0);
  const [tipCommentHover, setTipCommentHover] = useState(0);
  const [editingTipCommentId, setEditingTipCommentId] = useState(null);
  const [editTipCommentText, setEditTipCommentText] = useState('');

  // Helper to get the most-rated tip
  const getMostRatedTip = (tipsArr) => {
    if (!tipsArr || tipsArr.length === 0) return null;
    // Find tip with highest ratingCount; break ties by latest createdAt
    return tipsArr.reduce((prev, curr) => {
      if (curr.ratingCount > prev.ratingCount) return curr;
      if (curr.ratingCount === prev.ratingCount) {
        // If tie, show the latest tip
        return new Date(curr.createdAt) > new Date(prev.createdAt) ? curr : prev;
      }
      return prev;
    }, tipsArr[0]);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let tipsRes;
        if (showMyTips) {
          tipsRes = await getMyTips();
        } else {
          tipsRes = await getAllTips();
        }
        const featuredRes = await getFeaturedTips();
        setTips(tipsRes.data);
        setFilteredTips(tipsRes.data);
        setFeaturedTips(featuredRes.data);

        if (tipsRes.data && tipsRes.data.length > 0) {
          await loadUserRatings(tipsRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch tips:', err);
        setTips([]);
        setFilteredTips([]);
        setFeaturedTips([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [showMyTips]); 

  useEffect(() => {
    if (selectedTip) {
      getTipComments(selectedTip.id).then(res => setTipComments(res.data));
    }
  }, [selectedTip]);

  const loadUserRatings = async (tips) => {
    try {
      const ratingPromises = tips.map(tip => 
        getUserRating(tip.id, currentUserId)
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
        let res;
        if (showMyTips) {
          // Filter my tips locally
          const filtered = tips.filter(tip =>
            tip.title.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredTips(filtered);
        } else {
          res = await searchTips(query);
          setFilteredTips(res.data);
        }
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
        if (showMyTips) {
          // Filter my tips locally
          const filtered = tips.filter(tip => tip.category === category);
          setFilteredTips(filtered);
        } else {
          const res = await getTipsByCategory(category);
          setFilteredTips(res.data);
        }
      } catch (err) {
        console.error('Category filter failed:', err);
      }
    }
  };

  const handleRate = async (id, rating) => {
    try {
      setRatingLoading(id);
      await rateTip(id, rating, currentUserId);
      setRatingSuccess(id);

      // Update local user ratings
      setUserRatings(prev => ({
        ...prev,
        [id]: rating
      }));

      // FIX: Fetch only relevant tips after rating
      let updatedTips;
      if (showMyTips) {
        updatedTips = await getMyTips();
      } else {
        updatedTips = await getAllTips();
      }
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
        await deleteTip(id); // Auth handled in API
        // Refresh tips after deletion
        const updatedTips = showMyTips ? await getMyTips() : await getAllTips();
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
      await updateTip(editingTip.id, editForm); // Auth handled in API
      // Refresh tips after update
      const updatedTips = showMyTips ? await getMyTips() : await getAllTips();
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

  const handleTipReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedTip) return;
  
    // Create a new review object
    const newReview = {
      id: Date.now(), // Use a better unique id in production
      user: tipReviewUserName || 'Anonymous',
      text: tipReviewText,
      rating: tipUserRating,
      time: new Date().toISOString(),
    };
  
    // Add the new review to the tipReviews array
    setTipReviews(prev => [newReview, ...prev]);
  
    // Reset form fields
    setTipReviewText('');
    setTipUserRating(0);
  };

  const handleTipCommentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTip) return;
    const comment = {
      text: tipCommentText,
      rating: tipCommentRating,
      userName: tipCommentUserName,
    };
    const res = await addTipComment(selectedTip.id, comment);
    setTipComments([res.data, ...tipComments]);
    setTipCommentText('');
    setTipCommentRating(0);

    // Fetch updated tips to refresh rating/review count
    const updatedTips = showMyTips ? await getMyTips() : await getAllTips();
    setTips(updatedTips.data);
    setFilteredTips(updatedTips.data);
  };

  const handleTipCommentEdit = async (e, commentId) => {
    e.preventDefault();
    const comment = {
      text: editTipCommentText,
      rating: tipCommentRating,
    };
    const res = await updateTipComment(selectedTip.id, commentId, comment);
    setTipComments(tipComments.map(c => c.id === commentId ? res.data : c));
    setEditingTipCommentId(null);
  };

  const handleTipCommentDelete = async (commentId) => {
    await deleteTipComment(selectedTip.id, commentId);
    setTipComments(tipComments.filter(c => c.id !== commentId));
  };

  const categoryColors = {
    Storage: 'bg-blue-200 text-blue-800',
    Prep: 'bg-green-200 text-green-800',
    Substitutes: 'bg-yellow-200 text-yellow-800',
  };

  const renderStars = (tip, isTipOfDay = false) => {
    const currentHover = hoverRating[tip.id] || 0;
    const userRating = userRatings[tip.id];
    // Priority: hover > userRating > averageRating
    const displayRating = currentHover ? currentHover : (userRating ? userRating : Math.round(tip.averageRating));

    return (
      <div className="flex flex-col space-y-2">
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
              {hoverRating[tip.id] === star && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                  Rate {star} {star === 1 ? 'star' : 'stars'}
                </div>
              )}
            </div>
          ))}
          {userRating && (
            <span className="text-xs text-gray-500 ml-2 self-center">(Your rating)</span>
          )}
        </div>
        
        {/* Rating count display */}
        <div className="flex items-center text-sm text-gray-500">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{Math.round(tip.averageRating)}</span>
            <span className="mx-1">•</span>
            <span>{tip.ratingCount} {tip.ratingCount === 1 ? 'rating' : 'ratings'}</span>
          </span>
        </div>
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

  // Get the most-rated tip from filteredTips
  const mostRatedTip = getMostRatedTip(filteredTips);

  return (
    <div
      className="min-h-screen bg-gray-900 text-gray-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.75)), url(${tipBg})`,
        backgroundSize: 'cover',
        backgroundAttachment: "fixed"
      }}
    >
      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 bg-amber-500 hover:bg-amber-600 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-amber-400/30 transition-all duration-300 flex items-center justify-center"
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <div className="max-w-6xl mx-auto pt-28">
        {/* Modern Header with Glass Effect */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-6 md:mb-0 flex items-center">
            <span className="text-5xl mr-3">🍳</span> Cooking Tips & Hacks
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowMyTips(false)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${!showMyTips 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-600/30' 
                : 'bg-gray-200/90 text-gray-800 hover:bg-gray-300/90'}`}
            >
              All Tips
            </button>
            <button
              onClick={() => setShowMyTips(true)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${showMyTips 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-600/30' 
                : 'bg-gray-200/90 text-gray-800 hover:bg-gray-300/90'}`}
            >
              My Tips
            </button>
            <Link
              to="/addtip"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold shadow-md shadow-amber-600/30 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Share Your Tip
            </Link>
          </div>
        </div>

        {/* Most Rated Tip Card - Minimal Modern Style */}
        {mostRatedTip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 mb-12 flex flex-col justify-between"
          >
            <span className={
              mostRatedTip.category === 'Prep'
                ? 'bg-green-100 text-green-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm mb-2 inline-block'
                : mostRatedTip.category === 'Storage'
                ? 'bg-blue-100 text-blue-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm mb-2 inline-block'
                : mostRatedTip.category === 'Substitutes'
                ? 'bg-yellow-100 text-yellow-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm mb-2 inline-block'
                : 'bg-gray-100 text-gray-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm mb-2 inline-block'
            }>
              {mostRatedTip.category}
            </span>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">{mostRatedTip.title}</h3>
            <p className="text-gray-700 mb-4 line-clamp-3">{mostRatedTip.description}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">
                  {mostRatedTip.createdAt && format(new Date(mostRatedTip.createdAt), 'PPpp')}
                </span>
                <span className="text-xs text-gray-600">
                  Posted by <span className="font-semibold text-blue-700">{mostRatedTip.userDisplayName}</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center text-yellow-500 font-semibold">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {Math.round(mostRatedTip.averageRating * 10) / 10}
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                  <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2"></path>
                    <circle cx="12" cy="5" r="3"></circle>
                  </svg>
                  {mostRatedTip.reviewCount || 0}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Featured Tips Section - Enhanced */}
        {featuredTips.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredTips.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-amber-200 hover:border-amber-300 transition-all duration-300"
                >
                  <h3 className="font-semibold text-xl mb-3 text-gray-800">{tip.title}</h3>
                  <p className="text-gray-600 mb-4">{tip.description}</p>
                  <div className={`inline-block px-4 py-1.5 text-sm rounded-full font-medium ${categoryColors[tip.category]}`}>
                    {tip.category}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section - Enhanced */}
        <div className="mb-10 space-y-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cooking tips..."
              value={search}
              onChange={handleSearch}
              className="w-full px-5 py-4 pl-12 border-none rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-400/30 bg-white/90 backdrop-blur-sm text-gray-800 font-medium"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-white/80 text-gray-700 hover:bg-white/90'
              }`}
            >
              All Categories
            </button>
            {['Storage', 'Prep', 'Substitutes'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-white/80 text-gray-700 hover:bg-white/90'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTips.length > 0 ? (
            filteredTips.map((tip) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/90 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white cursor-pointer flex flex-col justify-between relative"
                onClick={() => setSelectedTip(tip)}
              >
                {/* Edit/Delete icons for own tips */}
                {(showMyTips || tip.userId === localStorage.getItem('userId')) && (
                  <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    <button
                      onClick={e => { e.stopPropagation(); handleEdit(tip); }}
                      className="text-gray-400 hover:text-blue-500 bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow"
                      title="Edit tip"
                    >
                      {/* Pencil icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); if(window.confirm('Are you sure you want to delete this tip?')) handleDelete(tip.id); }}
                      className="text-gray-400 hover:text-red-500 bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow"
                      title="Delete tip"
                    >
                      {/* Trash icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                <span className={
                  tip.category === 'Prep'
                    ? 'bg-green-100 text-green-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm mb-2 inline-block'
                    : tip.category === 'Storage'
                    ? 'bg-blue-100 text-blue-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm mb-2 inline-block'
                    : tip.category === 'Substitutes'
                    ? 'bg-yellow-100 text-yellow-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm mb-2 inline-block'
                    : 'bg-gray-100 text-gray-700 rounded-full px-4 py-1 text-sm font-semibold shadow-sm mb-2 inline-block'
                }>
                  {tip.category}
                </span>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{tip.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-3">{tip.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      {tip.createdAt && format(new Date(tip.createdAt), 'PPpp')}
                    </span>
                    <span className="text-xs text-gray-600">
                      Posted by <span className="font-semibold text-blue-700">{tip.userDisplayName}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-yellow-500 font-semibold">
                      <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {Math.round(tip.averageRating * 10) / 10}
                    </span>
                    <span className="flex items-center text-gray-500 text-sm">
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2"></path>
                        <circle cx="12" cy="5" r="3"></circle>
                      </svg>
                      {tip.reviewCount || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white/40 backdrop-blur-md rounded-xl p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700 text-xl font-medium">No tips found matching your criteria</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTip && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
          >
            <button
              onClick={() => setEditingTip(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors text-2xl"
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Update Your Tip</h2>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-gray-900 text-base shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-gray-900 text-base shadow resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-gray-900 text-base shadow"
                  required
                >
                  <option value="Storage">Storage</option>
                  <option value="Prep">Prep</option>
                  <option value="Substitutes">Substitutes</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTip(null)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg hover:from-amber-600 hover:to-amber-700 transition ${
                    editLoading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {editLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
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

      {/* Tip Details Modal */}
      {selectedTip && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-4 border-amber-400"
            style={{ width: '700px' }}
          >
            {/* Header with background image and overlay */}
            <div className="relative h-48 rounded-t-2xl overflow-hidden">
              <img
                src={tipBg}
                alt="Tip background"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center">
                <h3 className="text-3xl font-bold text-amber-400 mb-2 drop-shadow-lg">{selectedTip.title}</h3>
                <div className={`inline-block px-3 py-1 text-sm rounded-full bg-amber-500 text-gray-900 font-semibold shadow`}>
                  {selectedTip.category}
                </div>
              </div>
            </div>
            {/* Main content */}
            <div className="p-8">
              <div className="mb-2 text-gray-200 text-lg">{selectedTip.description}</div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-blue-300 font-medium">By {selectedTip.userDisplayName}</span>
                <span className="text-gray-400 text-sm">{selectedTip.createdAt && format(new Date(selectedTip.createdAt), 'PPpp')}</span>
              </div>
              {/* --- Tip Review Section --- */}
              <div className="mt-8 bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow border border-amber-400">
                <h2 className="text-2xl font-bold text-amber-400 mb-4 text-center">Community Reviews</h2>
                <form onSubmit={handleTipCommentSubmit} className="mb-8">
                  <input
                    type="text"
                    value={tipCommentUserName}
                    onChange={e => setTipCommentUserName(e.target.value)}
                    placeholder="Display Name"
                    className="w-full border border-amber-400 rounded-lg p-2 mb-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
                    required
                  />
                  <textarea
                    value={tipCommentText}
                    onChange={e => setTipCommentText(e.target.value)}
                    placeholder="Share your thoughts about this tip..."
                    className="w-full border border-amber-400 rounded-lg p-3 mb-2 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
                    rows="3"
                    required
                  />
                  <div className="flex items-center mb-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTipCommentRating(star)}
                        onMouseEnter={() => setTipCommentHover(star)}
                        onMouseLeave={() => setTipCommentHover(0)}
                        className="focus:outline-none"
                      >
                        <span className={`text-2xl ${(tipCommentHover || tipCommentRating) >= star ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-300">{tipCommentRating > 0 ? `${tipCommentRating} star${tipCommentRating !== 1 ? 's' : ''}` : 'Select rating'}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!tipCommentText.trim() || !tipCommentUserName.trim() || tipCommentRating === 0}
                    className="w-full px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold shadow-lg transition"
                  >
                    Submit Review
                  </button>
                </form>
                {tipComments.length > 0 ? (
                  <div className="space-y-6">
                    {tipComments.map(comment => (
                      <div key={comment.id} className="border-b border-amber-400 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-amber-300">{comment.userName}</h3>
                          <span className="text-sm text-gray-400">{new Date(comment.time).toLocaleString()}</span>
                        </div>
                        <div className="flex mb-2">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className={`text-xl ${(comment.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                          ))}
                        </div>
                        {editingTipCommentId === comment.id ? (
                          <form onSubmit={e => handleTipCommentEdit(e, comment.id)}>
                            <textarea
                              value={editTipCommentText}
                              onChange={e => setEditTipCommentText(e.target.value)}
                              className="w-full border border-amber-400 rounded-lg p-2 mb-2 bg-gray-900 text-white"
                              rows="2"
                            />
                            <button type="submit" className="mr-2 px-3 py-1 bg-amber-500 text-gray-900 rounded font-semibold">Update</button>
                            <button type="button" onClick={() => setEditingTipCommentId(null)} className="px-3 py-1 text-gray-300">Cancel</button>
                          </form>
                        ) : (
                          <>
                            <p className="text-gray-200 mb-2">{comment.text}</p>
                            {comment.userId === currentUserId && (
                              <div className="flex space-x-2">
                                <button onClick={() => { setEditingTipCommentId(comment.id); setEditTipCommentText(comment.text); setTipCommentRating(comment.rating); }} className="text-amber-400 font-semibold">Edit</button>
                                <button onClick={() => handleTipCommentDelete(comment.id)} className="text-red-400 font-semibold">Delete</button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">No reviews yet</div>
                )}
              </div>
              {/* --- End Tip Review Section mayomi --- */}
              <button
                className="mt-8 w-full px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 font-bold shadow-lg transition"
                onClick={() => setSelectedTip(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CookingTips;

