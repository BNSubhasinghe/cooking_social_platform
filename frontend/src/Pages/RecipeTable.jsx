import React, { useEffect, useState } from 'react';
import { getAllRecipes, deleteRecipe } from '../api/recipeApi';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RecipeTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await getAllRecipes();
      if (response && response.data) {
        setRecipes(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to load recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(id);
        fetchRecipes();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete. Please try again.');
      }
    }
  };

  const handlePdfExport = async (recipe) => {
    const doc = new jsPDF();
    
    // Set default font
    doc.setFont('helvetica');
    
    // Title (centered and uppercase)
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(recipe.title.toUpperCase(), 105, 25, { align: 'center' });
    
    // Description under title (centered)
    if (recipe.description) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(100, 100, 100);
      const descLines = doc.splitTextToSize(recipe.description, 180);
      doc.text(descLines, 105, 35, { align: 'center' });
      doc.setFont(undefined, 'normal');
    }
    
    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 45, 190, 45);
    
    let y = 55;
    
    // Add image if available (centered with proper scaling)
    if (recipe.mediaUrl) {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = `http://localhost:8080/recipes/image/${recipe.mediaUrl}`;
        
        await new Promise((resolve) => {
          img.onload = () => {
            const maxWidth = 160;
            const maxHeight = 120;
            let width = img.width;
            let height = img.height;
            
            // Scale down if too wide
            if (width > maxWidth) {
              const ratio = maxWidth / width;
              width = maxWidth;
              height = height * ratio;
            }
            
            // Scale down if too tall
            if (height > maxHeight) {
              const ratio = maxHeight / height;
              height = maxHeight;
              width = width * ratio;
            }
            
            doc.addImage(img, 'JPEG', (210 - width) / 2, y, width, height);
            y += height + 15;
            resolve();
          };
          img.onerror = () => {
            console.error('Error loading image for PDF');
            resolve();
          };
        });
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    }

    // Cooking time only (professional styling)
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(`Preparation Time: ${recipe.cookingTime} minutes`, 14, y);
    y += 15;

    // Ingredients section (professional styling)
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('INGREDIENTS', 14, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const ingredients = recipe.ingredients?.split('\n').filter(item => item.trim() !== '') || [];
    
    // Create a nice bullet point list
    ingredients.forEach(item => {
      const cleanItem = item.replace(/^[-•]\s*/, '').trim();
      doc.setTextColor(60, 60, 60);
      doc.text('•', 16, y);
      doc.setTextColor(40, 40, 40);
      doc.text(cleanItem, 22, y);
      y += 7;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    
    y += 10;

    // Instructions section with clean styling
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('INSTRUCTIONS', 14, y);
    y += 15;
    
    const instructions = recipe.instructions?.split('\n').filter(step => step.trim() !== '') || [];
    instructions.forEach((step, index) => {
      // Clean the step by removing any existing numbering or special characters
      const cleanStep = step
        .replace(/^Step\s*\d*[:.]*\s*/i, '')
        .replace(/^STE[P@][A-Za-z]*\s*/, '')
        .replace(/^[-•*]\s*/, '')
        .trim();
      
      // Step number (bold, blue)
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(63, 81, 181);
      doc.text(`Step ${index + 1}:`, 16, y);
      
      // Instruction text (normal, dark gray)
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(cleanStep, 160);
      doc.text(lines, 30, y);
      
      y += lines.length > 1 ? (lines.length * 7) : 10;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Professional footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 287);
    doc.setTextColor(63, 81, 181); // Blue accent color
    doc.setFont(undefined, 'bold');
    doc.text('RecipeMaster Pro', 105, 287, { align: 'center' });
    
    doc.save(`${recipe.title.replace(/[^a-z0-9]/gi, '_')}_recipe.pdf`);
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.category.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Recipe Collection</h1>
          <p className="text-gray-600">Browse and manage your delicious recipes</p>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search recipes by title or category..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate('/add-recipe')}
            className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add New Recipe
          </button>
        </div>

        {/* Recipe Cards with updated image styling */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="inline-block w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No recipes found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or add a new recipe</p>
            <button
              onClick={() => navigate('/add-recipe')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Recipe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Updated Recipe Image with hover effect */}
                <div className="h-56 overflow-hidden bg-gray-100 relative group">
                  {recipe.mediaUrl ? (
                    <img
                      src={`http://localhost:8080/recipes/image/${recipe.mediaUrl}`}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-food.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{recipe.title}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{recipe.cuisineType || 'Global'}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{recipe.cookingTime} min</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => navigate(`/update-recipe/${recipe.id}`)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete
                    </button>
                    <button
                      onClick={() => handlePdfExport(recipe)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeTable;