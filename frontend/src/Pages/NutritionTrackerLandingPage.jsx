import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaAppleAlt, FaRunning, FaChartPie, FaCarrot, FaStar, FaUtensils } from 'react-icons/fa';
import { GiWeightScale, GiFruitBowl } from 'react-icons/gi';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

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

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="relative">
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="relative h-screen overflow-hidden">
                    <img
                        src="public/images/nutLanding.jpg"
                        alt="Healthy food background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="container mx-auto px-4 py-32 text-center z-10">
                            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                                <motion.h1
                                    variants={itemVariants}
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg"
                                >
                                    Track Your <span className="text-green-400">Nutrition</span> & Thrive
                                </motion.h1>
                                <motion.p
                                    variants={itemVariants}
                                    className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto bg-black bg-opacity-40 p-4 rounded-lg"
                                >
                                    A smarter way to log meals, monitor health, and achieve your wellness goals.
                                </motion.p>
                                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        to="/nutrition-setup"
                                        className="px-8 py-3 bg-green-400 hover:bg-green-500 text-gray-900 font-bold rounded-lg shadow-lg transform hover:scale-105 transition"
                                    >
                                        Get Started
                                    </Link>
                                    <button
                                        onClick={handleViewLogsClick}
                                        className="px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-lg transition"
                                    >
                                        View My Logs
                                    </button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-gray-900">
                <div className="container mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-16 text-center">
                            Why Use Our Nutrition Tracker?
                        </motion.h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {benefits.map((feature) => (
                                <motion.div
                                    key={feature.id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gray-800 p-8 rounded-xl shadow-lg hover:bg-gray-700 transition"
                                >
                                    <div className="w-16 h-16 bg-green-400 text-gray-900 rounded-full flex items-center justify-center mb-6 mx-auto">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-center">{feature.title}</h3>
                                    <ul className="space-y-3 text-gray-300">
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

            {/* Signature Nutrition Plans Section */}
            <section className="py-16 px-4 bg-gray-900">
                <div className="container mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl md:text-4xl font-bold mb-12 text-center text-white"
                        >
                            Expert Nutrition Plans
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Plan 1 */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                            >
                                <div className="relative">
                                    <img
                                        src="/public/images/weight-loss-plan.jpg"
                                        alt="Weight Loss Plan"
                                        className="w-full h-64 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'public/images/food.jpg';
                                        }}
                                    />
                                    <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-full">
                                        <FaStar className="text-yellow-400 mr-1" />
                                        <span className="text-white text-sm font-medium">
                                            4.9 (128)
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3 text-white">Calorie Tracking</h3>
                                    <p className="text-gray-300 mb-5 line-clamp-3">
                                        Science-backed program combining calorie control with proper macronutrient balance for sustainable weight loss.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Plan 2 */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                            >
                                <div className="relative">
                                    <img
                                        src="/public/images/muscle-building-plan.jpg"
                                        alt="Muscle Building Plan"
                                        className="w-full h-64 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'public/images/water.jpg';
                                        }}
                                    />
                                    <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-full">
                                        <FaStar className="text-yellow-400 mr-1" />
                                        <span className="text-white text-sm font-medium">
                                            4.8 (245)
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3 text-white">Water Tracking</h3>
                                    <p className="text-gray-300 mb-5 line-clamp-3">
                                        Classic protein-rich nutrition protocol with precise timing for optimal muscle growth and recovery.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Plan 3 */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                            >
                                <div className="relative">
                                    <img
                                        src="/public/images/progress.jpg"
                                        alt="Wellness Plan"
                                        className="w-full h-64 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'public/images/food.jpg';
                                        }}
                                    />
                                    <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-full">
                                        <FaStar className="text-yellow-400 mr-1" />
                                        <span className="text-white text-sm font-medium">
                                            4.7 (187)
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3 text-white">Progress Tracking</h3>
                                    <p className="text-gray-300 mb-5 line-clamp-3">
                                        Balanced nutrition approach focusing on whole foods, micronutrients, and sustainable eating habits for long-term health.
                                    </p>
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
            <section className="py-16 px-4 bg-gray-800">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-12 text-center shadow-xl"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6">
                            Start Your Nutrition Journey Today
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of users who have transformed their health with our nutrition tracker.
                        </motion.p>
                        <motion.div variants={itemVariants}>
                            <button
                                onClick={handleViewLogsClick}
                                className="px-8 py-3 bg-white text-green-800 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition shadow-lg"
                            >
                                Begin Tracking Now
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default NutritionTrackerLanding;