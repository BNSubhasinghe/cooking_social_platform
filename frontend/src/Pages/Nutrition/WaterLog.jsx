import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Droplet, Plus, Minus, Check, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WaterLog = ({ userId, date, waterGoal = 8 }) => {
  const [glasses, setGlasses] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dailyWater, setDailyWater] = useState(0);
  const [waterHistory, setWaterHistory] = useState([]);

  // Fetch water intake data on mount
  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        const response = await api.get(
          `/nutrition/progress/daily/${userId}?date=${date}`
        );
        if (response.data) {
          setDailyWater(response.data.waterConsumed || 0);
          setWaterHistory(response.data.waterLogs || []);
        }
      } catch (err) {
        console.error("Failed to fetch water data:", err);
      }
    };

    fetchWaterData();
  }, [userId, date, message]);

  // Adjust glasses quantity
  const decrementGlasses = () => {
    setGlasses((prev) => Math.max(1, prev - 1));
  };

  const incrementGlasses = () => {
    setGlasses((prev) => prev + 1);
  };

  // Handle water log submission
  const handleLogWater = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`/nutrition/water/${userId}`, {
        glasses,
        date,
      });
      setMessage(response.data.message || "Water logged successfully!");
      setStatus("success");
      setGlasses(1);
    } catch (err) {
      setMessage(err.response?.data || "Failed to log water");
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

  // Calculate water progress percentage
  const waterPercentage = Math.min(
    100,
    Math.round((dailyWater / waterGoal) * 100)
  );

  // Format time from timestamp
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get water drops based on current intake
  const getWaterDrops = () => {
    const drops = [];
    const filledDrops = Math.min(8, dailyWater);

    for (let i = 0; i < 8; i++) {
      drops.push(
        <motion.div key={i} 
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ 
            scale: i < filledDrops ? 1 : 0.8,
            opacity: i < filledDrops ? 1 : 0.5
          }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Droplet
            size={i < filledDrops ? 28 : 22}
            className={`transition-all duration-300 ${
              i < filledDrops ? "text-blue-500 fill-blue-500" : "text-blue-200"
            }`}
          />
        </motion.div>
      );
    }
    return drops;
  };

  // Get hydration tip
  const getHydrationTip = () => {
    const tips = [
      "Drinking water improves energy levels, brain function, and helps maintain healthy skin.",
      "Try to drink a glass of water before each meal to help with digestion and portion control.",
      "Set reminders throughout the day to help you remember to stay hydrated.",
      "Carrying a reusable water bottle can help you drink more water throughout the day.",
      "If you're feeling hungry, drink water first. Sometimes thirst is mistaken for hunger."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
        <Droplet className="mr-3 text-blue-600" />
        Water Tracker
      </h2>

      {/* Water Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Daily Water Intake
          </span>
          <motion.span 
            className="text-sm font-bold"
            animate={{ scale: dailyWater >= waterGoal ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {dailyWater} / {waterGoal} glasses
          </motion.span>
        </div>
        <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${waterPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-blue-500 h-4 rounded-full shadow-md"
          ></motion.div>
        </div>
      </div>

      {/* Water Drop Visualization */}
      <div className="flex justify-center space-x-3 mb-8 bg-blue-50 p-4 rounded-2xl">
        {getWaterDrops()}
      </div>

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

      {/* Water Log Input */}
      <div className="space-y-5 bg-gray-50 p-6 rounded-xl mb-8">
        <h3 className="font-semibold text-lg text-gray-700 mb-4">Log Your Hydration</h3>

        <div className="flex flex-col items-center justify-center">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How many glasses did you drink?
          </label>
          <div className="flex items-center justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={decrementGlasses}
              className="p-3 bg-blue-100 rounded-l-lg border border-blue-200 hover:bg-blue-200 transition-all text-blue-700"
            >
              <Minus size={20} />
            </motion.button>
            <motion.div 
              key={glasses}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="px-10 py-3 border-t border-b border-blue-200 text-2xl font-bold text-blue-700"
            >
              {glasses}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={incrementGlasses}
              className="p-3 bg-blue-100 rounded-r-lg border border-blue-200 hover:bg-blue-200 transition-all text-blue-700"
            >
              <Plus size={20} />
            </motion.button>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleLogWater}
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
                <Droplet size={20} className="mr-2" />
                <span>
                  Log {glasses} Glass{glasses > 1 ? "es" : ""}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Water Intake Timeline */}
      {waterHistory.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Today's Hydration Timeline
          </h3>
          <div className="space-y-3 max-h-48 overflow-auto pr-2">
            <AnimatePresence>
              {waterHistory.map((log, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-all"
                >
                  <div className="mr-4 bg-blue-100 rounded-full p-2">
                    <Droplet size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {log.glasses} glass{log.glasses > 1 ? "es" : ""} of water
                    </div>
                    <div className="text-xs text-gray-500">{formatTime(log.date)}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Water Intake Tips */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="mt-6 p-5 bg-blue-50 rounded-xl text-sm text-blue-800 border border-blue-200 shadow-sm"
      >
        <div className="flex items-start">
          <Info size={18} className="mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
          <div>
            <p className="font-bold mb-1">Hydration Tip</p>
            <p>{getHydrationTip()}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WaterLog;
