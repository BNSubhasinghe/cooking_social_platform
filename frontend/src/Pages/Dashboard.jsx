import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FoodLog from "./Nutrition/FoodLog";
import WaterLog from "./Nutrition/WaterLog";
import DailyProgress from "./Progress/DailyProgress";
import WeeklyProgress from "./Progress/WeeklyProgress";
import api from "../utils/api";
import {
  CalendarDays,
  User,
  LogOut,
  TrendingUp,
  RefreshCw,
  Activity,
  LineChart,
  Utensils,
  Droplets,
} from "lucide-react";

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("daily"); // "daily" or "weekly"

  // Fetch progress
  const fetchProgress = async () => {
    if (!user?.id) {
      setError("User not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const endpoint =
        activeTab === "daily"
          ? `/nutrition/progress/daily/${user.id}?date=${date}`
          : `/nutrition/progress/weekly/${user.id}?startDate=${date}`;
      console.log(
        `Fetching progress for user ${user.id}, endpoint ${endpoint}`
      );
      const response = await api.get(endpoint);
      setProgress(response.data);
      setError("");
    } catch (err) {
      console.error(
        `Failed to fetch ${activeTab} progress:`,
        err.response?.data,
        err.response?.status
      );
      setError(
        err.response?.data?.message ||
          `Failed to load ${activeTab} progress data. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [date, user, activeTab]);

  if (!user || !user.id) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <User size={24} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">
            Please log in to view your nutrition dashboard.
          </p>
          <button
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all shadow-md"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Format date for header display
  const formatDateForHeader = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      {/* <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg mr-4">
                <Activity size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                Nutrition Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                <CalendarDays size={16} className="mr-2" />
                <span className="text-sm font-medium">{formatDateForHeader()}</span>
              </div>

              <div className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full">
                <User size={16} className="mr-2" />
                <span className="font-medium">{user.name}</span>
              </div>

              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                <span className="hidden sm:inline-block font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Date selector and tabs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="relative">
                <CalendarDays size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="date-select"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("daily")}
                className={`flex items-center px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "daily"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Activity size={16} className="mr-2" />
                Daily View
              </button>
              <button
                onClick={() => setActiveTab("weekly")}
                className={`flex items-center px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "weekly"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <LineChart size={16} className="mr-2" />
                Weekly View
              </button>
            </div>
          </div>
        </div>

        {/* Content area */}
        {loading && (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your nutrition data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => {
                setError("");
                fetchProgress();
              }}
              className="inline-flex items-center px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
                {activeTab === "daily" ? (
                  <Activity size={20} className="mr-2 text-blue-600" />
                ) : (
                  <LineChart size={20} className="mr-2 text-indigo-600" />
                )}
                <h2 className="text-lg font-bold text-gray-900">
                  {activeTab === "daily"
                    ? "Today's Progress"
                    : "Weekly Overview"}
                </h2>
              </div>
              <div className="p-6">
                {activeTab === "daily" && progress && (
                  <DailyProgress progress={progress} />
                )}
                {activeTab === "weekly" && progress && (
                  <WeeklyProgress userId={user.id} startDate={date} />
                )}
              </div>
            </div>

            {/* Food and Water Tracking Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Food Log */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center">
                  <Utensils size={20} className="mr-2 text-green-600" />
                  <h2 className="text-lg font-bold text-gray-900">Food Log</h2>
                </div>
                <div className="p-6">
                  {progress && (
                    <FoodLog
                      foodData={progress.foodLogs}
                      date={date}
                      userId={user.id}
                    />
                  )}
                </div>
              </div>

              {/* Water Log */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center">
                  <Droplets size={20} className="mr-2 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Water Intake</h2>
                </div>
                <div className="p-6">
                  {progress && (
                    <WaterLog
                      waterData={progress.waterLogs}
                      date={date}
                      userId={user.id}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
