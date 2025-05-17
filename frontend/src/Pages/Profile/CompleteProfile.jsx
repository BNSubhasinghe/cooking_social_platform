import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import { motion } from "framer-motion";
import { FiUser, FiAlertCircle, FiCheckCircle, FiSave, FiLoader } from "react-icons/fi";

// Complete Profile Component
const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    height: "",
    healthGoal: "",
    dietPreference: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    age: false,
    weight: false,
    height: false,
    healthGoal: false,
    dietPreference: false,
  });

  // Fetch existing profile data if available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.id) return;
      
      try {
        const response = await api.get(`/nutrition/profile/${user.id}`);
        if (response.data) {
          // Set any existing profile data
          setProfile(prevProfile => ({
            ...prevProfile,
            ...response.data
          }));
        }
      } catch (err) {
        // It's ok if profile doesn't exist yet
        console.log("No existing profile found");
      }
    };
    
    fetchProfile();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
  };
  
  // Handle field blur
  const handleBlur = (field) => {
    if (!touched[field]) {
      setTouched({ ...touched, [field]: true });
    }
  };

  // Validate form fields
  const validateField = (field, value) => {
    switch (field) {
      case "age":
        return value > 0 && value < 120;
      case "weight":
        return value > 20 && value < 500;
      case "height":
        return value > 50 && value < 300;
      case "healthGoal":
      case "dietPreference":
        return value !== "";
      default:
        return true;
    }
  };

  // Form validation
  const isFormValid = () => {
    return (
      validateField("age", profile.age) &&
      validateField("weight", profile.weight) &&
      validateField("height", profile.height) &&
      validateField("healthGoal", profile.healthGoal) &&
      validateField("dietPreference", profile.dietPreference)
    );
  };

  // Handle profile submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    setTouched({
      age: true,
      weight: true,
      height: true,
      healthGoal: true,
      dietPreference: true,
    });
    
    // Validate form
    if (!isFormValid()) {
      setError("Please fill out all fields correctly");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await api.put(`/nutrition/profile/${user.id}`, profile);
      setSuccess("Profile updated successfully!");
      login({ ...user, profileCompleted: true });
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getFieldClassName = (field) => {
    return `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
      touched[field] && !validateField(field, profile[field])
        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
    }`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="bg-indigo-100 rounded-full p-3">
            <FiUser className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Complete Your Profile
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          Help us personalize your experience
        </p>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <FiAlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <FiCheckCircle className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              id="age"
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              onBlur={() => handleBlur("age")}
              placeholder="Enter your age"
              className={getFieldClassName("age")}
            />
            {touched.age && !validateField("age", profile.age) && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid age (1-119)</p>
            )}
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              onBlur={() => handleBlur("weight")}
              placeholder="Enter your weight in kg"
              className={getFieldClassName("weight")}
            />
            {touched.weight && !validateField("weight", profile.weight) && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid weight (20-500 kg)</p>
            )}
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              id="height"
              type="number"
              name="height"
              value={profile.height}
              onChange={handleChange}
              onBlur={() => handleBlur("height")}
              placeholder="Enter your height in cm"
              className={getFieldClassName("height")}
            />
            {touched.height && !validateField("height", profile.height) && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid height (50-300 cm)</p>
            )}
          </div>
          
          <div>
            <label htmlFor="healthGoal" className="block text-sm font-medium text-gray-700 mb-1">
              Health Goal
            </label>
            <select
              id="healthGoal"
              name="healthGoal"
              value={profile.healthGoal}
              onChange={handleChange}
              onBlur={() => handleBlur("healthGoal")}
              className={getFieldClassName("healthGoal")}
            >
              <option value="">Select Health Goal</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="improve_health">Improve Overall Health</option>
              <option value="increase_energy">Increase Energy</option>
            </select>
            {touched.healthGoal && !validateField("healthGoal", profile.healthGoal) && (
              <p className="mt-1 text-sm text-red-600">Please select a health goal</p>
            )}
          </div>
          
          <div>
            <label htmlFor="dietPreference" className="block text-sm font-medium text-gray-700 mb-1">
              Diet Preference
            </label>
            <select
              id="dietPreference"
              name="dietPreference"
              value={profile.dietPreference}
              onChange={handleChange}
              onBlur={() => handleBlur("dietPreference")}
              className={getFieldClassName("dietPreference")}
            >
              <option value="">Select Diet Preference</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="low_carb">Low Carb</option>
              <option value="omnivore">Omnivore</option>
              <option value="other">Other</option>
            </select>
            {touched.dietPreference && !validateField("dietPreference", profile.dietPreference) && (
              <p className="mt-1 text-sm text-red-600">Please select a diet preference</p>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full mt-6 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Saving...
              </span>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Profile
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
