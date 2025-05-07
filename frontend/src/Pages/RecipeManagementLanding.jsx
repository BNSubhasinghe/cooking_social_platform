import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaShare, FaEdit, FaRegComment } from 'react-icons/fa';
import { GiCookingPot, GiChefToque } from 'react-icons/gi';

const RecipeManagementLanding = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      id: 1,
      title: "Easy Sharing",
      icon: <FaShare className="text-3xl" />,
      items: [
        "Simple, intuitive recipe submission",
        "Beautiful recipe cards automatically generated",
        "One-click sharing to social media"
      ]
    },
    {
      id: 2,
      title: "Engaged Community",
      icon: <FaRegComment className="text-3xl" />,
      items: [
        "Connect with fellow food lovers",
        "Get feedback on your recipes",
        "Build your following as a creator"
      ]
    },
    {
      id: 3,
      title: "Recipe Analytics",
      icon: <FaEdit className="text-3xl" />,
      items: [
        "See how many people view your recipes",
        "Track saves and downloads",
        "Understand what recipes perform best"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative h-screen overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070" 
            alt="Cooking ingredients"
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
                  Organize Your <span className="text-amber-400">Recipes</span> Like a Pro Chef
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-100 font-medium bg-black bg-opacity-40 p-4 rounded-lg"
                >
                  The ultimate digital recipe box for home cooks and professional chefs
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link 
                    to="/add-recipe" 
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                    Create New Recipe
                  </Link>
                  <Link 
                    to="/" 
                    className="px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-lg transition-all"
                  >
                    Explore Recipes
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Share Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-16 text-center text-white"
            >
              Why Share With Us?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <motion.div 
                  key={feature.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-16 h-16 bg-amber-500 text-gray-900 rounded-full flex items-center justify-center mb-6 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center text-white">{feature.title}</h3>
                  <ul className="space-y-3">
                    {feature.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FaStar className="text-amber-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recipe Showcase Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <motion.div 
              variants={itemVariants}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Your <span className="text-amber-400">Recipes</span>, Beautifully Organized
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                View your recipes in multiple layouts with all the details you need. Our clean interface makes recipe management a pleasure.
              </p>
              <div className="space-y-6">
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0 bg-amber-500 text-gray-900 p-3 rounded-lg mr-4">
                    <GiChefToque className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">Edit Anytime</h4>
                    <p className="text-gray-200">
                      Update ingredients or instructions with just a few clicks
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0 bg-amber-500 text-gray-900 p-3 rounded-lg mr-4">
                    <FaStar className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">Top Recipes</h4>
                    <p className="text-gray-200">
                      Highest-rated recipes automatically highlighted with our smart ranking system
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0 bg-amber-500 text-gray-900 p-3 rounded-lg mr-4">
                    <GiCookingPot className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">Mobile Friendly</h4>
                    <p className="text-gray-200">
                      Access your recipes from any device, anywhere - perfect for cooking on the go
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ✅ Clean Video Section - No Text */}
            <motion.div 
              variants={itemVariants}
              className="lg:w-1/2 mt-10 lg:mt-0"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover rounded-2xl"
                >
                  <source src="/videos/4253147-uhd_4096_2160_25fps.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - with static image background */}
      <section
        className="relative py-24 px-4 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cta-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-md"
          >
            Ready to Share Your Recipes With the World?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto text-white font-medium"
          >
            Join our community of food enthusiasts and showcase your culinary creations
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Start Sharing Now
            </Link>
            <Link 
              to="/recipe-table" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold rounded-lg transition-all"
            >
              Recipe Dashboard
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RecipeManagementLanding;
