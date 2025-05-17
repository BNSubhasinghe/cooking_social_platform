// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from "react-router-dom";

// Common Layout
import Header from "./Components/Header";
import Footer from "./Components/Footer";

// Recipe Management Pages
import RecipeList from "./Pages/RecipeList";
import RecipeDetails from "./Pages/RecipeDetails";
import AddRecipe from "./Pages/AddRecipe";
import RecipeTable from "./Pages/RecipeTable";
import UpdateRecipe from "./Pages/UpdateRecipe";
import RecipeManagementLanding from "./Pages/RecipeManagementLanding";

// Challenges Pages
import ChallengesPage from "./Pages/ChallengesPage";
import ChallengeLanding from "./Pages/ChallengeLanding";

// Cooking Tips Pages
import CookingTips from "./Pages/CookingTips"; // mayomi
import AddTip from "./Pages/AddTip"; // mayomi

// Auth & Wellness Context
import { AuthProvider } from "./context/AuthContext.jsx";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

// Auth Pages
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import CompleteProfile from "./Pages/Profile/CompleteProfile.jsx";

// Protected Routes
import ProtectedRoute from "./Pages/ProtectedRoute.jsx";

// Dashboard & Reminders
import Dashboard from "./Pages/Dashboard.jsx";
import Reminders from "./Pages/Reminders.jsx";
import ErrorBoundary from "./Pages/ErrorBoundary.jsx";

// Wellness Tracker Pages
import FoodLog from "./Pages/Nutrition/FoodLog.jsx";
import WaterLog from "./Pages/Nutrition/WaterLog.jsx";
import DailyProgress from "./Pages/Progress/DailyProgress.jsx";

// API utils
import api from "./utils/api";

// Callback for OAuth
const AuthCallback = () => {
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          const userData = {
            token,
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            profileCompleted: response.data.profileCompleted || false,
          };
          login(userData);
        })
        .catch(() => {
          window.location.href = "/login?error=Authentication%20failed";
        });
    } else {
      window.location.href = "/login?error=No%20token%20provided";
    }
  }, [searchParams, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Processing authentication...</p>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Header />
          <Reminders />
          <Routes>
            {/* ---------- RECIPE & CHALLENGE MODULES ---------- */}
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipe-table" element={<RecipeTable />} />
            <Route path="/update-recipe/:id" element={<UpdateRecipe />} />
            <Route path="/landing-page" element={<RecipeManagementLanding />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/challenge-landing" element={<ChallengeLanding />} />
            <Route path="/cookingTips" element={<CookingTips />} />
            <Route path="/addtip" element={<AddTip />} />

            {/* ---------- AUTH & WELLNESS MODULES ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-success" element={<AuthCallback />} />

            <Route
              path="/profile/complete"
              element={
                <ProtectedRoute>
                  <CompleteProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-log"
              element={
                <ProtectedRoute>
                  <FoodLog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/water-log"
              element={
                <ProtectedRoute>
                  <WaterLog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daily-progress"
              element={
                <ProtectedRoute>
                  <DailyProgress />
                </ProtectedRoute>
              }
            />

            {/* ---------- FALLBACK ---------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
