import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { User, Trash2, AlertCircle, Edit2, Save, X, Camera, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { user, logout, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchProfile = async () => {
    if (!user?.id) {
      setError("User not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/user/profile/${user.id}`);
      setProfile(response.data);
      setEditedProfile(response.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch profile:", err.response?.data);
      setError(
        err.response?.data?.message || "Failed to load profile data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/user/${user.id}`);
      logout();
      navigate("/login?message=Account%20deleted%20successfully");
    } catch (err) {
      console.error("Failed to delete account:", err.response?.data);
      setError(
        err.response?.data?.message || "Failed to delete account. Please try again."
      );
      setShowDeleteConfirm(false);
    }
  };

  // Handle input change in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const response = await api.put(`/user/profile/${user.id}`, editedProfile);
      setProfile(response.data);
      setIsEditing(false);
      
      // Update the user context with new name if it changed
      if (editedProfile.name !== user.name) {
        login({
          ...user,
          name: editedProfile.name
        });
      }
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data);
      setError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (!user || !user.id) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      {/* <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Your Profile
          </h1>
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full"
            >
              <User size={18} className="mr-2" />
              <span className="font-medium">{user.name}</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v-7a2 2 0 00-2-2H5"
                />
              </svg>
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Message */}
        <AnimatePresence>
          {updateSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-lg flex items-center bg-green-50 text-green-700 border-l-4 border-green-500"
            >
              <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center items-center h-64 bg-white rounded-xl shadow-lg"
          >
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-blue-600 mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your profile data...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Unable to Load Profile</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setError("");
                fetchProfile();
              }}
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw size={18} className="mr-2" />
              Retry
            </motion.button>
          </motion.div>
        )}

        {/* Profile Content */}
        {!loading && !error && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 md:h-48 relative">
              <div className="absolute -bottom-16 left-8 bg-white p-2 rounded-full shadow-xl">
                {profile.profileImage ? (
                  <img
                    className="h-28 w-28 rounded-full object-cover border-4 border-white"
                    src={profile.profileImage}
                    alt="Profile"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white">
                    <User size={56} className="text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="pt-20 px-8 pb-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                </div>
                
                {/* Edit/Save Buttons */}
                <div>
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                    >
                      <Edit2 size={16} className="mr-2" />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={cancelEditing}
                        className="inline-flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        <X size={16} className="mr-1" />
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUpdateProfile}
                        disabled={saving}
                        className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {saving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editedProfile.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                      <p className="text-gray-900">{profile.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="age"
                          value={editedProfile.age || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.age || "Not set"}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Weight (kg)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="weight"
                            value={editedProfile.weight || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile.weight ? `${profile.weight} kg` : "Not set"}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Height (cm)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="height"
                            value={editedProfile.height || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile.height ? `${profile.height} cm` : "Not set"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Health & Nutrition Preferences */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Health & Nutrition Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Health Goal</label>
                      {isEditing ? (
                        <select
                          name="healthGoal"
                          value={editedProfile.healthGoal || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a goal</option>
                          <option value="weight_loss">Weight Loss</option>
                          <option value="muscle_gain">Muscle Gain</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="improve_health">Improve Overall Health</option>
                          <option value="increase_energy">Increase Energy</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 capitalize">
                          {profile.healthGoal?.replace(/_/g, ' ') || "Not set"}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Diet Preference</label>
                      {isEditing ? (
                        <select
                          name="dietPreference"
                          value={editedProfile.dietPreference || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select diet preference</option>
                          <option value="vegan">Vegan</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="pescatarian">Pescatarian</option>
                          <option value="keto">Keto</option>
                          <option value="paleo">Paleo</option>
                          <option value="low_carb">Low Carb</option>
                          <option value="omnivore">Omnivore</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 capitalize">
                          {profile.dietPreference?.replace(/_/g, ' ') || "Not set"}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Daily Calorie Goal (kcal)
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="dailyCalorieGoal"
                            value={editedProfile.dailyCalorieGoal || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile.dailyCalorieGoal ? `${profile.dailyCalorieGoal} kcal` : "Not set"}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Daily Water Goal (glasses)
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="dailyWaterGoal"
                            value={editedProfile.dailyWaterGoal || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profile.dailyWaterGoal ? `${profile.dailyWaterGoal} glasses` : "Not set"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account Management */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Account Management
                </h3>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                      <AlertCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                      Delete Your Account?
                    </h3>
                    <p className="text-gray-600 mb-6 text-center">
                      This action cannot be undone. All your personal data, recipes, and activity will be permanently deleted.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDeleteAccount}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Delete Account
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Profile;
