import axios from "axios";

const BASE_URL = "http://localhost:8080/api/challenges";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllChallenges = () => api.get("/");
export const getActiveChallenges = () => api.get("/active");
export const getAllActiveChallenges = () => api.get("/active/all");
export const getPastChallenges = () => api.get("/past");
export const getChallengeById = (id) => api.get(`/${id}`);
export const getChallengeLeaderboard = (id) => api.get(`/${id}/leaderboard`);

export const createChallenge = (formData) => {
  return api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateChallenge = (id, formData) => {
  return api.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteChallenge = (id) => api.delete(`/${id}`);

// If needed, you can still pass recipeId as a param
export const submitToChallenge = (id, recipeId) => 
  api.post(`/${id}/submit`, null, { params: { recipeId } });

export const voteForSubmission = (id, recipeId) => 
  api.post(`/${id}/vote/${recipeId}`);

export const unvoteForSubmission = (id, recipeId) =>
  api.post(`/${id}/unvote/${recipeId}`);