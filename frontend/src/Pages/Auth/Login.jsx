import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import { motion } from "framer-motion";
import { 
  FiAlertCircle, 
  FiEye, 
  FiEyeOff, 
  FiLoader,
  FiMail,
  FiLock 
} from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useContext(AuthContext);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverError, setServerError] = useState("");
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && user.token) {
      navigate("/dashboard");
    }
    
    // Check for URL parameters (e.g., from OAuth callback)
    const params = new URLSearchParams(location.search);
    if (params.get("error")) {
      setServerError(decodeURIComponent(params.get("error")));
    }
  }, [user, navigate, location]);

  // Validation rules
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  // Handle input change & validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    
    // Clear server error when user starts typing
    if (serverError) setServerError("");
    
    // Validate field if it was touched or form was already submitted
    if (touched[name] || submitAttempted) {
      validateField(name, value);
    }
  };
  
  // Handle field blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    if (field === "email") validateField("email", email);
    if (field === "password") validateField("password", password);
  };
  
  // Validate a single field
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(value)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    }
    
    if (name === "password") {
      if (!value) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(value)) {
        newErrors.password = "Password must be at least 6 characters";
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ email: true, password: true });
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setServerError("");
    
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      }
      
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    // Redirect to backend's Google OAuth endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>
        
        {serverError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <FiAlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{serverError}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                onBlur={() => handleBlur("email")}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange}
                onBlur={() => handleBlur("password")}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-3 border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border-0 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.37-.98 2.53-2.07 3.3v2.74h3.34c1.95-1.8 3.07-4.45 3.07-7.8z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.34-2.74c-1.01.68-2.3 1.08-3.94 1.08-3.03 0-5.6-2.05-6.52-4.81H2.07v3.03C3.88 20.65 7.75 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.48 14.36c-.23-.68-.36-1.41-.36-2.16s.13-1.48.36-2.16V7.01H2.07c-.7 2.14-1.07 4.42-1.07 6.75s.37 4.61 1.07 6.75h3.41v-3.03z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16C17.46 2.01 14.97 1 12 1 7.75 1 3.88 3.35 2.07 7.01h3.41v3.03c.92-2.76 3.49-4.66 6.52-4.66z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-medium">Sign in with Google</span>
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
