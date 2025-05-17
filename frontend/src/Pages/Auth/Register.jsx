import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiUser,
  FiMail,
  FiLock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

// Register Component
const Register = () => {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverError, setServerError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.token) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Validation rules
  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Requires at least 8 characters, 1 uppercase, 1 lowercase, and 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateConfirmPassword = (confirmPassword) => {
    return confirmPassword === password;
  };

  // Password strength criteria checks
  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  // Handle input change & validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") {
      setPassword(value);
      // Also validate confirm password if it's already been entered
      if (confirmPassword && touched.confirmPassword) {
        validateField("confirmPassword", confirmPassword);
      }
    }
    if (name === "confirmPassword") setConfirmPassword(value);

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

    if (field === "name") validateField("name", name);
    if (field === "email") validateField("email", email);
    if (field === "password") validateField("password", password);
    if (field === "confirmPassword")
      validateField("confirmPassword", confirmPassword);
  };

  // Validate a single field
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === "name") {
      if (!value.trim()) {
        newErrors.name = "Name is required";
      } else if (!validateName(value)) {
        newErrors.name = "Name must be at least 2 characters";
      } else {
        delete newErrors.name;
      }
    }

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
        newErrors.password = "Password doesn't meet requirements";
      } else {
        delete newErrors.password;
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (!validateConfirmPassword(value)) {
        newErrors.confirmPassword = "Passwords don't match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!validateName(name)) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password doesn't meet requirements";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!validateConfirmPassword(confirmPassword)) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        registrationSource: "CREDENTIAL",
      });
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Join our community today</p>
        </div>

        {serverError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <FiAlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleInputChange}
                onBlur={() => handleBlur("name")}
                placeholder="Enter your name"
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : touched.name
                    ? "border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
              />
              {touched.name && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {errors.name ? (
                    <FiXCircle className="text-red-500" />
                  ) : (
                    <FiCheckCircle className="text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
                className={`w-full pl-10 pr-10 py-3 border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : touched.email
                    ? "border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
              />
              {touched.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {errors.email ? (
                    <FiXCircle className="text-red-500" />
                  ) : (
                    <FiCheckCircle className="text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
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
                placeholder="Create a password"
                className={`w-full pl-10 pr-10 py-3 border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : touched.password && validatePassword(password)
                    ? "border-green-500 focus:ring-green-500"
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

            {/* Password strength indicator */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-1">
                <div
                  className={`h-1 flex-1 rounded-full ${
                    passwordCriteria.minLength ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded-full ${
                    passwordCriteria.hasUppercase ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded-full ${
                    passwordCriteria.hasLowercase ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded-full ${
                    passwordCriteria.hasNumber ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              </div>
              <div className="flex text-xs text-gray-500 justify-between">
                <span
                  className={
                    passwordCriteria.minLength ? "text-green-600" : ""
                  }
                >
                  8+ chars
                </span>
                <span
                  className={
                    passwordCriteria.hasUppercase ? "text-green-600" : ""
                  }
                >
                  Uppercase
                </span>
                <span
                  className={
                    passwordCriteria.hasLowercase ? "text-green-600" : ""
                  }
                >
                  Lowercase
                </span>
                <span
                  className={
                    passwordCriteria.hasNumber ? "text-green-600" : ""
                  }
                >
                  Number
                </span>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Confirm your password"
                className={`w-full pl-10 pr-10 py-3 border ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : touched.confirmPassword && confirmPassword
                    ? "border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
              />
              {touched.confirmPassword && confirmPassword && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {errors.confirmPassword ? (
                    <FiXCircle className="text-red-500" />
                  ) : (
                    <FiCheckCircle className="text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center mt-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-gray-700"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-blue-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
