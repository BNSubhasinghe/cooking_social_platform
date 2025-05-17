import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaAppleAlt, FaRunning, FaChartPie, FaCarrot, FaStar, FaUtensils } from 'react-icons/fa';
import { GiWeightScale, GiFruitBowl } from 'react-icons/gi';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { RiLeafFill } from 'react-icons/ri';
import { IoWaterOutline } from 'react-icons/io5';
import { FiTrendingUp } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

const NutritionTrackerLanding = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Featured healthy recipes data
    const featuredRecipes = [
        {
            id: 1,
            title: "Quinoa Power Bowl",
            description: "Protein-rich quinoa bowl with roasted vegetables and avocado - perfect balance of complex carbs and healthy fats.",
            image: "/public/images/quinoa-bowl.jpg",
            rating: 4.9,
            reviewCount: 128,
            calories: 420,
            protein: "24g"
        },
        {
            id: 2,
            title: "Baked Salmon Plate",
            description: "Omega-3 rich salmon with steamed vegetables and whole grains for a complete nutritional profile.",
            image: "/public/images/salmon-plate.jpg",
            rating: 4.8,
            reviewCount: 245,
            calories: 380,
            protein: "32g"
        },
        {
            id: 3,
            title: "Berry Protein Smoothie",
            description: "Antioxidant-packed smoothie with protein powder, berries and almond milk - perfect pre-workout fuel.",
            image: "/public/images/berry-smoothie.jpg",
            rating: 4.7,
            reviewCount: 187,
            calories: 280,
            protein: "18g"
        }
    ];

    const handleViewLogsClick = () => {
        if (user && user.token) {
            navigate('/dashboard');
        } else {
            navigate('/login', { state: { from: '/dashboard' } });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const benefits = [
        {
            id: 1,
            title: "Personalized Goals",
            icon: <FaHeartbeat className="text-3xl" />,
            items: [
                "Set calorie and nutrient targets",
                "Track macros aligned with your lifestyle",
                "Daily reminders to stay on track"
            ]
        },
        {
            id: 2,
            title: "Smart Food Logging",
            icon: <FaAppleAlt className="text-3xl" />,
            items: [
                "Quick search and scan food items",
                "One-tap logging for frequent meals",
                "Auto-suggestions based on your goals"
            ]
        },
        {
            id: 3,
            title: "Progress Monitoring",
            icon: <FaChartPie className="text-3xl" />,
            items: [
                "Visual charts for weight & nutrient intake",
                "Compare week-to-week performance",
                "Celebrate milestones and achievements"
            ]
        }
    ];

    const featuredTips = [
        {
            id: 1,
            title: "Stay Hydrated",
            description: "Track your daily water intake and get gentle reminders to keep drinking throughout the day.",
            icon: <GiFruitBowl className="text-5xl text-blue-300" />
        },
        {
            id: 2,
            title: "Balanced Meals",
            description: "Learn how to balance your meals with the right mix of protein, carbs, and fats.",
            icon: <FaCarrot className="text-5xl text-orange-300" />
        },
        {
            id: 3,
            title: "Daily Movement",
            description: "Integrate your activity data for more accurate calorie tracking.",
            icon: <FaRunning className="text-5xl text-green-300" />
        }
    ];

    // Add this for scroll-triggered animations
    const [heroRef, heroInView] = useInView({
        triggerOnce: true,
        threshold: 0.3
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Hero Section styled to match RecipeManagementLanding */}
            <section className="relative">
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="relative h-screen overflow-hidden">
                    <img 
                        src="public/images/nutLanding.jpg"
                        alt="Healthy food background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="container mx-auto px-4 py-32 z-10 text-center">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                            >
                                <motion.h1 
                                    variants={itemVariants}
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg"
                                >
                                    Track Your <span className="text-green-400">Nutrition</span> & Thrive
                                </motion.h1>
                                <motion.p 
                                    variants={itemVariants}
                                    className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-100 font-medium bg-black bg-opacity-40 p-4 rounded-lg"
                                >
                                    A smarter way to log meals, monitor health, and achieve your wellness goals
                                </motion.p>
                                <motion.div 
                                    variants={itemVariants}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <Link 
                                        to="/nutrition-setup"
                                        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-gray-900 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                                    >
                                        Get Started
                                    </Link>
                                    <button
                                        onClick={handleViewLogsClick}
                                        className="px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-lg transition-all"
                                    >
                                        View My Logs
                                    </button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Enhanced Features Section */}
            <section className="py-24 px-4 bg-gradient-to-b from-gray-900 to-gray-800 relative">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
                <div className="container mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-20 text-center">
                            Why Use Our <span className="text-green-400">Nutrition Tracker</span>?
                        </motion.h2>
                        <div className="grid md:grid-cols-3 gap-10">
                            {benefits.map((feature) => (
                                <motion.div
                                    key={feature.id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-gray-800 to-gray-700 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition border border-gray-700"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 text-gray-900 rounded-full flex items-center justify-center mb-8 mx-auto transform -translate-y-16 shadow-lg">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-5 text-center -mt-6">{feature.title}</h3>
                                    <ul className="space-y-4 text-gray-300">
                                        {feature.items.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <FaHeartbeat className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Signature Nutrition Plans Section with Floating Cards */}
            <section className="py-24 px-4 bg-gradient-to-b from-gray-800 to-gray-900 relative">
                <div className="container mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl md:text-5xl font-bold mb-16 text-center text-white"
                        >
                            Premium <span className="text-green-400">Nutrition</span> Features
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Plan 1 */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 border border-gray-700"
                            >
                                <div className="relative">
                                    <img
                                        src="/public/images/weight-loss-plan.jpg"
                                        alt="Weight Loss Plan"
                                        className="w-full h-64 object-cover transform hover:scale-105 transition-all duration-700"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'public/images/food.jpg';
                                        }}
                                    />
                                    <div className="absolute top-3 right-3 bg-green-400 text-gray-900 rounded-full p-2">
                                        <RiLeafFill className="text-xl" />
                                    </div>
                                    <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 backdrop-blur-sm px-3 py-2 rounded-full">
                                        <FaStar className="text-yellow-400 mr-2" />
                                        <span className="text-white text-sm font-medium">
                                            4.9 (128)
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-4 text-white">Calorie Tracking</h3>
                                    <p className="text-gray-300 mb-6 line-clamp-3">
                                        Science-backed program combining calorie control with proper macronutrient balance for sustainable weight loss.
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-400 text-sm font-medium">POPULAR CHOICE</span>
                                        <button className="text-white hover:text-green-400 transition-colors">
                                            Learn more →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Plan 2 */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 border border-gray-700"
                            >
                                <div className="relative">
                                    <img
                                        src="/public/images/muscle-building-plan.jpg"
                                        alt="Muscle Building Plan"
                                        className="w-full h-64 object-cover transform hover:scale-105 transition-all duration-700"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'public/images/water.jpg';
                                        }}
                                    />
                                    <div className="absolute top-3 right-3 bg-blue-400 text-gray-900 rounded-full p-2">
                                        <IoWaterOutline className="text-xl" />
                                    </div>
                                    <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 backdrop-blur-sm px-3 py-2 rounded-full">
                                        <FaStar className="text-yellow-400 mr-2" />
                                        <span className="text-white text-sm font-medium">
                                            4.8 (245)
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-4 text-white">Water Tracking</h3>
                                    <p className="text-gray-300 mb-6 line-clamp-3">
                                        Smart hydration monitoring with daily water intake goals, reminders, and tracking of your hydration status.
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-blue-400 text-sm font-medium">STAY HYDRATED</span>
                                        <button className="text-white hover:text-blue-400 transition-colors">
                                            Learn more →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Plan 3 */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 border border-gray-700"
                            >
                                <div className="relative">
                                    <img
                                        src="/public/images/progress.jpg"
                                        alt="Progress Tracking"
                                        className="w-full h-64 object-cover transform hover:scale-105 transition-all duration-700"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'public/images/food.jpg';
                                        }}
                                    />
                                    <div className="absolute top-3 right-3 bg-purple-400 text-gray-900 rounded-full p-2">
                                        <FiTrendingUp className="text-xl" />
                                    </div>
                                    <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 backdrop-blur-sm px-3 py-2 rounded-full">
                                        <FaStar className="text-yellow-400 mr-2" />
                                        <span className="text-white text-sm font-medium">
                                            4.7 (187)
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-4 text-white">Progress Tracking</h3>
                                    <p className="text-gray-300 mb-6 line-clamp-3">
                                        Visual analytics to track your nutrition journey with customizable dashboards and progress milestones.
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-purple-400 text-sm font-medium">VISUALIZE RESULTS</span>
                                        <button className="text-white hover:text-purple-400 transition-colors">
                                            Learn more →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Wellness Tips Section */}
            <section className="py-16 px-4 bg-gray-900">
                <div className="container mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-12 text-center">
                            Wellness Tips to Stay Motivated
                        </motion.h2>
                        <div className="grid md:grid-cols-3 gap-10">
                            {featuredTips.map((tip) => (
                                <motion.div
                                    key={tip.id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gray-700 p-8 rounded-xl shadow-lg hover:bg-gray-600 transition text-center"
                                >
                                    <div className="mb-6 flex justify-center">{tip.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
                                    <p className="text-gray-300">{tip.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 px-4 bg-gray-800 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 translate-y-1/3 -translate-x-1/3"></div>
                
                <div className="container mx-auto max-w-5xl relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 md:p-16 text-center shadow-2xl border border-gray-700 backdrop-blur-sm relative overflow-hidden"
                    >
                        {/* Accent lines */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-blue-500 opacity-80"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-400 rounded-full filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="inline-block mb-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full p-3"
                        >
                            <FaChartPie className="text-gray-900 text-3xl" />
                        </motion.div>
                        
                        <motion.h2 
                            variants={itemVariants} 
                            className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-white"
                        >
                            Start Your Nutrition Journey Today
                        </motion.h2>
                        
                        <motion.p 
                            variants={itemVariants} 
                            className="text-xl mb-12 max-w-2xl mx-auto text-gray-300"
                        >
                            Join <span className="text-green-400 font-semibold">thousands of users</span> who have transformed their health and reached their goals with our comprehensive nutrition tracking platform.
                        </motion.p>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <button
                                onClick={handleViewLogsClick}
                                className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-gray-900 font-bold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-900/30 flex items-center"
                            >
                                <span className="mr-2">Begin Tracking Now</span>
                                <FaChartPie />
                            </button>
                            
                        </motion.div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="mt-10 flex items-center justify-center space-x-6 text-sm text-gray-400"
                        >
                            <div className="flex items-center">
                                <FaStar className="text-yellow-500 mr-2" />
                                <span>4.9 User Rating</span>
                            </div>
                            <div className="flex items-center">
                                <FaHeartbeat className="text-green-500 mr-2" />
                                <span>10,000+ Active Users</span>
                            </div>
                            <div className="flex items-center">
                                <FaUtensils className="text-blue-500 mr-2" />
                                <span>500+ Recipes</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default NutritionTrackerLanding;