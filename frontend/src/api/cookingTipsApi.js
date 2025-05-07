import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tips';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllTips = () => api.get(BASE_URL);
export const getTipOfTheDay = () => api.get(`${BASE_URL}/tip-of-the-day`);
export const searchTips = (query) => api.get(`${BASE_URL}/search?title=${query}`);
export const addTip = async (tip) => {
  try {
    const response = await api.post(BASE_URL, tip);
    return response;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw error;
  }
};
export const updateTip = (id, tip) => api.put(`${BASE_URL}/${id}`, tip);
export const deleteTip = (id) => api.delete(`${BASE_URL}/${id}`);
export const rateTip = (id, rating, userId) => api.put(`${BASE_URL}/${id}/rate?rating=${rating}&userId=${userId}`);
export const getFeaturedTips = () => api.get(`${BASE_URL}/featured`);
export const getTipsByCategory = (category) => api.get(`${BASE_URL}/category?category=${category}`);
export const getUserRating = (tipId, userId) => api.get(`${BASE_URL}/${tipId}/user-rating?userId=${userId}`);
