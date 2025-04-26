import axios from "axios";

const BASE_URL = "http://localhost:8080/api/challenges";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


export const getAllChallenges = () => api.get("/");
export const getActiveChallenges = () => api.get("/active");
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

export const submitToChallenge = (id, recipeId) => 
  api.post(`/${id}/submit`, null, { params: { recipeId } });

export const voteForSubmission = (id, recipeId) => 
  api.post(`/${id}/vote/${recipeId}`);