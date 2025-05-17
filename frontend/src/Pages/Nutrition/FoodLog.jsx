import { useState, useEffect } from "react";
import api from "../../utils/api";
import { PlusCircle, Check, AlertCircle, Trash2, Utensils, Coffee, Pizza, Cookie, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FoodLog = ({ userId, date, calorieGoal = 2000 }) => {
  const [foodLog, setFoodLog] = useState({
    mealType: "",
    foodName: "",
    calories: "",
    date,
  });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // "success" or "error"
  const [isLoading, setIsLoading] = useState(false);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [recentLogs, setRecentLogs] = useState([]);
  const [deletingId, setDeletingId] = useState(null); // Track which item is being deleted
  const [confirmDelete, setConfirmDelete] = useState(null); // Store item to confirm deletion
  
  // Fetch daily calories and recent logs on mount
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await api.get(
          `/nutrition/progress/daily/${userId}?date=${date}`
        );
        if (response.data) {
          setDailyCalories(response.data.caloriesConsumed || 0);
          setRecentLogs(response.data.foodLogs || []);
        }
      } catch (err) {
        console.error("Failed to fetch nutrition data:", err);
      }
    };

    fetchNutritionData();
  }, [userId, date, message]);

  // Handle input changes
  const handleChange = (e) => {
    setFoodLog({ ...foodLog, [e.target.name]: e.target.value });
  };

  // Handle food log submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodLog.mealType || !foodLog.foodName || !foodLog.calories) {
      setMessage("Please fill in all fields");
      setStatus("error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/nutrition/food/${userId}`, foodLog);
      setMessage(response.data.message || "Food logged successfully!");
      setStatus(response.data.warning ? "warning" : "success");
      setFoodLog({ mealType: "", foodName: "", calories: "", date });
    } catch (err) {
      setMessage(err.response?.data || "Failed to log food");
      setStatus("error");
    } finally {
      setIsLoading(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 3000);
    }
  };

  // Handle food log deletion
  const handleDelete = async (foodLogId, foodName) => {
    setDeletingId(foodLogId); // Set which item is being deleted
    setIsLoading(true);
    try {
      const response = await api.delete(
        `/nutrition/food/${userId}/${foodLogId}`
      );
      setMessage(`"${foodName}" has been deleted from your food log`);
      setStatus("success");
      
      // Update the local state to immediately remove the deleted item
      setRecentLogs(recentLogs.filter(log => log.id !== foodLogId));
      
    } catch (err) {
      setMessage(err.response?.data || "Failed to delete food log");
      setStatus("error");
    } finally {
      setIsLoading(false);
      setDeletingId(null); // Reset deleting state

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 3000);
    }
  };

  // Modified handleDelete to show confirmation first
  const handleDeleteClick = (foodLogId, foodName) => {
    setConfirmDelete({ id: foodLogId, name: foodName });
  };

  // Actual delete function after confirmation
  const confirmDeleteItem = async () => {
    if (!confirmDelete) return;
    
    const { id, name } = confirmDelete;
    setDeletingId(id);
    setIsLoading(true);
    
    try {
      await api.delete(`/nutrition/food/${userId}/${id}`);
      setMessage(`"${name}" has been deleted from your food log`);
      setStatus("success");
      
      // Update the local state to immediately remove the deleted item
      setRecentLogs(recentLogs.filter(log => log.id !== id));
      
    } catch (err) {
      setMessage(err.response?.data || "Failed to delete food log");
      setStatus("error");
    } finally {
      setIsLoading(false);
      setDeletingId(null);
      setConfirmDelete(null); // Close confirmation dialog

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 3000);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  // Calculate calorie progress percentage
  const caloriePercentage = Math.min(
    100,
    Math.round((dailyCalories / calorieGoal) * 100)
  );

  // Get progress bar color based on percentage
  const getProgressColor = () => {
    if (caloriePercentage > 100) return "bg-red-500";
    if (caloriePercentage > 85) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Get icon for meal type
  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'breakfast': return <Coffee size={16} className="mr-1" />;
      case 'lunch': return <Utensils size={16} className="mr-1" />;
      case 'dinner': return <Pizza size={16} className="mr-1" />;
      case 'snack': return <Cookie size={16} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
        <Utensils className="mr-3 text-blue-600" />
        Food Tracker
      </h2>

      {/* Calorie Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Daily Calories
          </span>
          <motion.span 
            className="text-sm font-bold"
            animate={{ scale: dailyCalories > calorieGoal ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {dailyCalories} / {calorieGoal} kcal
          </motion.span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${caloriePercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${getProgressColor()} h-4 rounded-full shadow-md`}
          ></motion.div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 p-5 bg-red-50 rounded-lg border border-red-200"
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h4 className="font-bold text-red-700">Delete Confirmation</h4>
            </div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <strong>"{confirmDelete.name}"</strong> from your food log? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteItem}
                disabled={isLoading}
                className={`px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors flex items-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center ${
              status === "success"
                ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                : status === "warning"
                ? "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500"
                : "bg-red-100 text-red-700 border-l-4 border-red-500"
            }`}
          >
            {status === "success" ? (
              <Check size={20} className="mr-3 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="mr-3 flex-shrink-0" />
            )}
            <span className="font-medium">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Log Form */}
      <div className="space-y-5 bg-gray-50 p-6 rounded-xl">
        <h3 className="font-semibold text-lg text-gray-700 mb-4">Add New Entry</h3>
        
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="mealType"
          >
            Meal Type
          </label>
          <select
            id="mealType"
            name="mealType"
            value={foodLog.mealType}
            onChange={handleChange}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          >
            <option value="">Select Meal</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="foodName"
          >
            Food Name
          </label>
          <input
            id="foodName"
            type="text"
            name="foodName"
            value={foodLog.foodName}
            onChange={handleChange}
            placeholder="e.g., Grilled Chicken Salad"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="calories"
          >
            Calories
          </label>
          <input
            id="calories"
            type="number"
            name="calories"
            value={foodLog.calories}
            onChange={handleChange}
            placeholder="e.g., 350"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={isLoading}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          className={`w-full flex items-center justify-center p-3 rounded-lg text-white font-medium ${
            isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } transition-all shadow-md`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging...
            </span>
          ) : (
            <>
              <PlusCircle size={20} className="mr-2" />
              <span>Add Food</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Recent Logs */}
      {recentLogs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Recent Entries
          </h3>
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {recentLogs.slice(0, 3).map((log, index) => (
                <motion.div
                  key={log.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition-all"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      {getMealIcon(log.mealType)}
                    </div>
                    <div>
                      <p className="font-medium">{log.foodName}</p>
                      <p className="text-sm text-gray-500 capitalize flex items-center">
                        {log.mealType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-5">
                    <p className="font-bold text-lg">{log.calories} <span className="text-xs text-gray-500">kcal</span></p>
                    <motion.button
                      whileHover={{ scale: 1.2, color: '#ef4444' }}
                      onClick={() => handleDeleteClick(log.id, log.foodName)}
                      disabled={isLoading || confirmDelete}
                      className={`text-gray-400 hover:text-red-500 transition-colors ${
                        isLoading && deletingId === log.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="Delete entry"
                    >
                      {isLoading && deletingId === log.id ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FoodLog;
