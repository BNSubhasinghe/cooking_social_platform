import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipeById, saveRating, saveComment, updateComment, deleteComment } from '../api/recipeApi';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftRightIcon, ArrowUturnLeftIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [userName, setUserName] = useState('You');

  const capitalizeName = (name) => {
    return name.replace(/\b\w/g, char => char.toUpperCase());
  };

  useEffect(() => {
    const savedStatus = localStorage.getItem(`saved-${id}`);
    if (savedStatus) setIsSaved(savedStatus === 'true');
    
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(capitalizeName(storedName));
  }, [id]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const res = await getRecipeById(id);
        const recipeWithIds = {
          ...res.data,
          comments: (res.data.comments || [])
            .map(comment => ({
              ...comment,
              id: comment.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
              user: capitalizeName(comment.user),
              rating: comment.rating || 0,
              helpful: comment.helpful || 0
            }))
            .sort((a, b) => new Date(b.time) - new Date(a.time))
        };
        setRecipe(recipeWithIds);
      } catch (err) {
        setError('Failed to load recipe. Please try again later.');
        console.error('Error fetching recipe:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const renderIngredients = (text) => {
    if (!text) return null;
    
    // Split by lines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Check if the first line starts with a bullet point
    if (lines.length > 0 && lines[0].trim().startsWith('')) {
      return lines.map((line, index) => (
        <li key={index} className="text-gray-700">
          {line.trim()}
        </li>
      ));
    }
    
    // If no bullet points, add them
    return lines.map((line, index) => (
      <li key={index} className="text-gray-700">
        - {line.trim()}
      </li>
    ));
  };

  const renderInstructions = (text) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim()).map((line, index) => (
      <li key={index} className="mb-4">
        <span className="font-bold">Step {index + 1}:</span> {line.replace(/^Step \d+:/, '').trim()}
      </li>
    ));
  };

  const handleRateRecipe = async (rating) => {
    try {
      setUserRating(rating);
      await saveRating(id, rating);
      const res = await getRecipeById(id);
      setRecipe(res.data);
    } catch (err) {
      console.error('Failed to save rating:', err);
      setError('Failed to save rating. Please try again.');
    }
  };

  const handleSaveRecipe = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    localStorage.setItem(`saved-${id}`, newState);
  };

  const handlePrintRecipe = () => {
    if (!recipe) return;

    const printContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #222;">${recipe.title}</h1>
          ${recipe.description ? `<p style="font-size: 16px; color: #555; margin-bottom: 20px; font-style: italic;">${recipe.description}</p>` : ''}
        </div>
        
        ${recipe.mediaUrl ? `
          <div style="margin: 20px 0; text-align: center;">
            <img src="http://localhost:8080/recipes/image/${recipe.mediaUrl}" alt="${recipe.title}" 
              style="max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
              onerror="this.onerror=null;this.src='https://via.placeholder.com/800x500?text=Recipe+Image';" />
          </div>
        ` : ''}
        
        <div style="display: flex; gap: 30px;">
          <div style="flex: 1;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #444; border-bottom: 1px solid #eee; padding-bottom: 8px;">Ingredients</h2>
            <ul style="list-style-type: none; padding-left: 0; margin: 0;">
              ${recipe.ingredients ? recipe.ingredients.split('\n').filter(line => line.trim()).map((line, index) => `
                <li style="margin-bottom: 8px; padding-left: 0;">
                   ${line.trim()}
                </li>
              `).join('') : '<li>No ingredients listed</li>'}
            </ul>
          </div>
          
          <div style="flex: 2;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #444; border-bottom: 1px solid #eee; padding-bottom: 8px;">Directions</h2>
            <ol style="list-style-type: none; padding-left: 0; margin: 0;">
              ${recipe.instructions ? recipe.instructions.split('\n').filter(line => line.trim()).map((line, index) => `
                <li style="margin-bottom: 15px; padding-left: 0;">
                  <span style="font-weight: bold;">Step ${index + 1}:</span> ${line.replace(/^Step \d+:/, '').trim()}
                </li>
              `).join('') : '<li>No instructions provided</li>'}
            </ol>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          Printed from Recipe App on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recipe.title} - Recipe</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              size: auto;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShareRecipe = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Check out this delicious recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleNameChange = (e) => {
    const newName = capitalizeName(e.target.value);
    setUserName(newName);
    localStorage.setItem('userName', newName);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !userName.trim()) {
      alert('Please fill in both your name and comment before posting.');
      return;
    }

    try {
      const newComment = {
        user: userName,
        text: commentText,
        rating: userRating,
        avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
        time: new Date().toISOString(),
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        helpful: 0
      };

      await saveComment(id, newComment);
      setRecipe(prev => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])]
      }));
      setCommentText('');
      setUserRating(0);
    } catch (err) {
      console.error('Failed to save comment:', err);
      setError('Failed to post comment. Please try again.');
    }
  };

  const startEditingComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentText);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleEditComment = async (e, commentId) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;

    try {
      const updatedComment = {
        text: editCommentText,
        time: new Date().toISOString(),
        user: userName,
        rating: userRating
      };

      await updateComment(id, commentId, updatedComment);
      
      setRecipe(prev => ({
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, ...updatedComment }
            : comment
        ).sort((a, b) => new Date(b.time) - new Date(a.time))
      }));
      
      cancelEditing();
    } catch (err) {
      console.error('Failed to update comment:', err);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleHelpfulClick = async (commentId) => {
    try {
      const comment = recipe.comments.find(c => c.id === commentId);
      const updatedComment = {
        ...comment,
        helpful: (comment.helpful || 0) + 1
      };

      await updateComment(id, commentId, updatedComment);
      
      setRecipe(prev => ({
        ...prev,
        comments: prev.comments.map(c => 
          c.id === commentId ? updatedComment : c
        )
      }));
    } catch (err) {
      console.error('Failed to update helpful count:', err);
    }
  };

  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await deleteComment(id, commentToDelete);
      
      setRecipe(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentToDelete)
      }));

      if (editingCommentId === commentToDelete) {
        cancelEditing();
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete comment. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
      setCommentToDelete(null);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!recipe) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Are you sure you want to delete this comment?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteComment}
                className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to recipes
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
        
        <div className="flex items-center mb-4">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${star <= Math.round(recipe.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600">
            <span className="font-semibold">{(recipe.averageRating || 0).toFixed(1)}</span> ({recipe.ratingCount || 0} ratings)
          </span>
        </div>

        {recipe.description && (
          <p className="text-gray-600 mb-4 text-base">{recipe.description}</p>
        )}
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={handleSaveRecipe}
            className={`flex items-center px-3 py-1 rounded-lg ${isSaved ? 'bg-green-100 text-green-800' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSaved ? "M5 13l4 4L19 7" : "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"} />
            </svg>
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button 
            onClick={() => document.getElementById('rating-section').scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center px-3 py-1 rounded-lg text-blue-600 hover:bg-blue-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Rate
          </button>
          <button 
            onClick={handlePrintRecipe}
            className="flex items-center px-3 py-1 rounded-lg text-blue-600 hover:bg-blue-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button 
            onClick={handleShareRecipe}
            className="flex items-center px-3 py-1 rounded-lg text-blue-600 hover:bg-blue-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>

      {recipe.mediaUrl && (
        <div className="mb-8">
          <img
            src={`http://localhost:8080/recipes/image/${recipe.mediaUrl}`}
            alt={recipe.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x500?text=Recipe+Image';
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Ingredients</h2>
            <ul className="space-y-2">
              {renderIngredients(recipe.ingredients) || <li className="text-gray-500">No ingredients listed</li>}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Directions</h2>
            <ol className="space-y-4">
              {renderInstructions(recipe.instructions) || <li className="text-gray-500">No instructions provided</li>}
            </ol>
          </div>
        </div>
      </div>

      <div id="rating-section" className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Rate this recipe</h2>
        <div className="flex items-center mb-2">
          <div className="flex mr-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRateRecipe(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-8 w-8 ${(hoverRating || userRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <span className="text-gray-600">You rated this {userRating} star{userRating !== 1 ? 's' : ''}</span>
          )}
        </div>
        <p className="text-sm text-gray-500">Your rating helps others discover great recipes!</p>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Community Reviews</h2>
          <div className="text-gray-600">{recipe.comments?.length || 0} reviews</div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={handleNameChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter your display name"
            required
          />
        </div>

        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div>
            <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              id="commentText"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Share your thoughts about this recipe..."
              rows="4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center mt-2 mb-4">
            <div className="flex mr-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={`h-6 w-6 ${(hoverRating || userRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {userRating > 0 ? `${userRating} star${userRating !== 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              onClick={() => {
                setCommentText('');
                setUserRating(0);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!commentText.trim() || !userName.trim() || userRating === 0}
              className={`px-6 py-2 rounded-lg ${commentText.trim() && userName.trim() && userRating > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Submit Review
            </button>
          </div>
        </form>

        {recipe.comments?.length > 0 ? (
          <div className="space-y-6">
            {recipe.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{comment.user}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.time).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${(comment.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                {editingCommentId === comment.id ? (
                  <div className="mt-4">
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      rows="3"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              className="focus:outline-none"
                            >
                              <StarIcon
                                className={`h-5 w-5 ${userRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleEditComment(e, comment.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 mb-4">{comment.text}</p>
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleHelpfulClick(comment.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
                        Helpful ({comment.helpful || 0})
                      </button>
                      
                      {comment.user.toLowerCase() === userName.toLowerCase() && (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              startEditingComment(comment.id, comment.text);
                              setUserRating(comment.rating || 0);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteComment(comment.id)}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-600">No reviews yet</h3>
            <p className="mt-1 text-gray-500">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;