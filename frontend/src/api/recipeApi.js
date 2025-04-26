import axios from "axios";

const BASE_URL = "http://localhost:8080";

// ✅ Get all recipes
export const getAllRecipes = () => axios.get(`${BASE_URL}/recipes`);

// ✅ Get a recipe by ID
export const getRecipeById = (id) => axios.get(`${BASE_URL}/recipes/${id}`);

// ✅ Create a new recipe (JSON-based)
export const createRecipe = (recipeData) =>
  axios.post(`${BASE_URL}/recipes`, recipeData);

// ✅ Upload recipe image (returns filename string)cd
export const uploadRecipeImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE_URL}/recipes/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✅ FIXED: Update recipe (multipart/form-data with JSON + optional image)
export const updateRecipe = (id, recipeData, file) => {
  const formData = new FormData();
  formData.append("recipeDetails", JSON.stringify(recipeData)); // JSON stringified
  if (file) {
    formData.append("file", file); // only if image selected
  }

  return axios.put(`${BASE_URL}/recipes/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Search by category
export const searchByCategory = (category) =>
  axios.get(`${BASE_URL}/recipes/category/${category}`);

// ✅ Delete recipe
export const deleteRecipe = (id) =>
  axios.delete(`${BASE_URL}/recipes/${id}`);
// Save rating
export const saveRating = (id, rating) =>
  axios.put(`${BASE_URL}/recipes/${id}/rate?rating=${rating}`);

// Save comment
export const saveComment = (id, comment) =>
  axios.post(`${BASE_URL}/recipes/${id}/comment`, comment);


// Update comment
export const updateComment = (recipeId, commentId, commentData) =>
  axios.put(`${BASE_URL}/recipes/${recipeId}/comment/${commentId}`, commentData);

// Delete comment
export const deleteComment = (recipeId, commentId) =>
  axios.delete(`${BASE_URL}/recipes/${recipeId}/comment/${commentId}`);
