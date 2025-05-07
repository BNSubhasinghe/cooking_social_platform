import { useState } from 'react';
import { addTip } from '../api/cookingTipsApi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddTip = () => {
  const [tip, setTip] = useState({
    title: '',
    description: '',
    category: 'Storage',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTip({ ...tip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!tip.title || !tip.description || !tip.category) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting tip:', tip);
      const response = await addTip(tip);
      console.log('Response:', response);
      
      if (response && response.data) {
        setSuccess('Tip added successfully!');
        // Clear form after successful submission
        setTip({
          title: '',
          description: '',
          category: 'Storage',
        });
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate('/addtip');
        }, 1500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Add tip failed:', err);
      setError(err.response?.data?.message || 'Failed to add tip. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">➕ Add a Cooking Tip</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={tip.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter tip title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={tip.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Share your cooking tip..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={tip.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                <option value="Storage">Storage</option>
                <option value="Prep">Prep</option>
                <option value="Substitutes">Substitutes</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/addtip')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Tip'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTip;
