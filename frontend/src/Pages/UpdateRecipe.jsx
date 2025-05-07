import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecipeById, updateRecipe, uploadRecipeImage } from '../api/recipeApi';
import { FaCamera, FaUtensils, FaClock, FaListUl, FaBookOpen } from 'react-icons/fa';
import { GiCook, GiMeal } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    category: '',
    cuisineType: '',
    mediaUrl: ''
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" }
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await getRecipeById(id);
        const data = res.data;
        setRecipeData({
          title: data.title || '',
          description: data.description || '',
          ingredients: data.ingredients || '',
          instructions: data.instructions || '',
          cookingTime: data.cookingTime || '',
          category: data.category || '',
          cuisineType: data.cuisineType || '',
          mediaUrl: data.mediaUrl || ''
        });
        
        if (data.mediaUrl) {
          setPreview(`http://localhost:8080/recipes/image/${data.mediaUrl}`);
        }
      } catch (err) {
        toast.error('Error fetching recipe data');
      }
    };
    fetchRecipe();
  }, [id]);

  const capitalizeWords = (text) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatIngredients = (text) => {
    const lines = text.split('\n');
    return lines
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        return trimmed.startsWith('•') ? trimmed : `• ${capitalizeWords(trimmed)}`;
      })
      .join('\n');
  };

  const formatInstructions = (text) => {
    const lines = text.split('\n');
    let stepCount = 0;
    
    return lines
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        const cleanLine = trimmed.replace(/^Step\s*\d+[:.]?\s*/i, '');
        stepCount++;
        return `Step ${stepCount}: ${cleanLine.charAt(0).toUpperCase() + cleanLine.slice(1)}`;
      })
      .join('\n');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title') {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setRecipeData({ ...recipeData, [name]: capitalizeWords(value) });
      }
    } else if (name === 'description') {
      if (/^[A-Za-z0-9\s,.'"-]*$/.test(value)) {
        const formattedDesc = value.charAt(0).toUpperCase() + value.slice(1);
        setRecipeData({ ...recipeData, [name]: formattedDesc });
      }
    } else if (name === 'ingredients') {
      const formatted = formatIngredients(value);
      setRecipeData({ ...recipeData, ingredients: formatted });
    } else if (name === 'instructions') {
      const formatted = formatInstructions(value);
      setRecipeData({ ...recipeData, instructions: formatted });
    } else if (name === 'cookingTime') {
      if (value === '' || (Number(value) > 0)) {
        setRecipeData({ ...recipeData, [name]: value });
      }
    } else {
      setRecipeData({ ...recipeData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.match('image.*')) {
      setFile(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
      toast.error('Please select a valid image file (JPEG, PNG, etc.)');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!recipeData.title || !/^[A-Za-z\s]+$/.test(recipeData.title)) {
      newErrors.title = 'Title is required and must contain only letters and spaces';
    }

    if (!recipeData.description) {
      newErrors.description = 'Description is required';
    }

    if (!recipeData.ingredients) {
      newErrors.ingredients = 'Ingredients are required';
    }

    if (!recipeData.instructions) {
      newErrors.instructions = 'Instructions are required';
    }

    if (!recipeData.cookingTime || isNaN(recipeData.cookingTime) || Number(recipeData.cookingTime) < 1) {
      newErrors.cookingTime = 'Cooking time must be at least 1 minute';
    }

    if (!recipeData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!recipeData.cuisineType) {
      newErrors.cuisineType = 'Please select a cuisine type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Updating your recipe...');

    try {
      // Prepare the recipe data without the file
      const recipeUpdateData = { 
        ...recipeData,
        ingredients: recipeData.ingredients.replace(/^•\s*/gm, '• '),
      };

      // Use the API service that handles file upload separately
      const response = await updateRecipe(id, recipeUpdateData, file);
      
      toast.update(toastId, {
        render: 'Recipe updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });

      // Success animation before navigation
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/recipe-table');
    } catch (error) {
      console.error('Error:', error);
      toast.update(toastId, {
        render: error.message || 'Failed to update recipe. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Update Your</span>
            <span className="block text-indigo-600">Culinary Creation</span>
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            Modify the details below to update your recipe
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Recipe ID */}
            <motion.div variants={itemVariants} className="px-6 py-5 bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <GiCook className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <label className="block text-sm font-medium text-gray-700">Recipe ID</label>
                  <input
                    type="text"
                    value={id}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants} className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <FaUtensils className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={recipeData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Rosemary Lemon Grilled Chicken"
                  />
                  <AnimatePresence>
                    {errors.title && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.title}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="px-6 py-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <FaBookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={recipeData.description}
                    onChange={handleChange}
                    rows="3"
                    className={`mt-1 block w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Zesty, herby, juicy grilled chicken with a hint of lemon..."
                  />
                  <AnimatePresence>
                    {errors.description && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Ingredients */}
            <motion.div variants={itemVariants} className="px-6 py-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <FaListUl className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Ingredients <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="ingredients"
                    value={recipeData.ingredients}
                    onChange={handleChange}
                    rows="6"
                    className={`mt-1 block w-full border ${errors.ingredients ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono`}
                    placeholder={`• 4 chicken breasts\n• 2 tbsp olive oil\n• 1 lemon, juiced and zested\n• 2 sprigs fresh rosemary`}
                    style={{ whiteSpace: 'pre-line' }}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter each ingredient on a new line (bullets added automatically)
                  </p>
                  <AnimatePresence>
                    {errors.ingredients && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.ingredients}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div variants={itemVariants} className="px-6 py-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <GiMeal className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Instructions <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="instructions"
                    value={recipeData.instructions}
                    onChange={handleChange}
                    rows="8"
                    className={`mt-1 block w-full border ${errors.instructions ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder={`Step 1: Marinate chicken with lemon juice, zest, and rosemary\nStep 2: Preheat grill to medium-high heat`}
                    style={{ whiteSpace: 'pre-line' }}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter each step on a new line (steps numbered automatically)
                  </p>
                  <AnimatePresence>
                    {errors.instructions && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.instructions}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Cooking Time */}
            <motion.div variants={itemVariants} className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <FaClock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Cooking Time (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={recipeData.cookingTime}
                    onChange={handleChange}
                    min="1"
                    className={`mt-1 block w-full border ${errors.cookingTime ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="20"
                  />
                  <AnimatePresence>
                    {errors.cookingTime && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.cookingTime}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Category & Cuisine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-5">
              {/* Category */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={recipeData.category}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="">Select Category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Soup">Soup</option>
                </select>
                <AnimatePresence>
                  {errors.category && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.category}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Cuisine Type */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700">
                  Cuisine Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="cuisineType"
                  value={recipeData.cuisineType}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.cuisineType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="">Select Cuisine</option>
                  <option value="Indian">Indian</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Japanese">Japanese</option>
                  <option value="SriLankan">Sri Lankan</option>
                </select>
                <AnimatePresence>
                  {errors.cuisineType && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.cuisineType}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Image Upload */}
            <motion.div variants={itemVariants} className="px-6 py-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <FaCamera className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Recipe Image (optional)
                  </label>
                  <div className="mt-2 flex items-center">
                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      Choose File
                    </label>
                    <span className="ml-2 text-sm text-gray-500">
                      {file ? file.name : 'No file chosen'}
                    </span>
                  </div>
                  {preview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4"
                    >
                      <div className="relative w-40 h-40 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={preview}
                          alt="Recipe preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {file ? 'New image preview' : 'Current recipe image'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="px-6 py-5 bg-gray-50 flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/recipe-table')}
                className="w-1/3 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-1/3 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Recipe'
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UpdateRecipe;