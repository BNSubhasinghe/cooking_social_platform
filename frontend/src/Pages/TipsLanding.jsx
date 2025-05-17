import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TipsLanding = () => {
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative h-screen overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1556911073-a517e752729c?q=80&w=2070" 
            alt="Cooking tips background"
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
                  Master the <span className="text-blue-400">Cooking Tips</span> & Tricks
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-100 font-medium bg-black bg-opacity-40 p-4 rounded-lg"
                >
                  Learn professional techniques, ingredient hacks, and kitchen secrets from culinary experts.
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link 
                    to="/addtip" 
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                    Share a Tip
                  </Link>
                  <Link 
                    to="/cookingTips" 
                    className="px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-lg transition-all"
                  >
                    Browse Tips
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Tip Categories</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore our most popular cooking tip categories and elevate your culinary skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Knife Skills",
                icon: "🔪",
                description: "Master cutting techniques for faster, safer food prep",
                color: "from-blue-600 to-cyan-400"
              },
              {
                title: "Flavor Pairing",
                icon: "🌶️",
                description: "Learn which ingredients work together for amazing taste",
                color: "from-purple-600 to-pink-400"
              },
              {
                title: "Time Savers",
                icon: "⏱️",
                description: "Quick hacks to save time in the kitchen without sacrificing quality",
                color: "from-amber-500 to-orange-400"
              },
              {
                title: "Plating & Presentation",
                icon: "🍽️",
                description: "Make your dishes look as good as they taste",
                color: "from-emerald-600 to-green-400"
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={`/tips/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="bg-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                    <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
                    <div className="p-6">
                      <div className="text-3xl mb-3">{category.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                      <p className="text-gray-300">{category.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tips Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Tips</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover our community's most popular cooking tips and tricks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Perfect Rice Every Time",
                author: "Chef Michael",
                image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=800",
                likes: 342
              },
              {
                title: "Quick Flavor Boosters for Any Dish",
                author: "Julia's Kitchen",
                image: "https://images.unsplash.com/photo-1505714197102-6ae95091ed70?q=80&w=800",
                likes: 289
              },
              {
                title: "Knife Sharpening Made Easy",
                author: "Pro Chef Alex",
                image: "https://images.unsplash.com/photo-1566454825481-9c31bd88afcd?q=80&w=800",
                likes: 217
              }
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={tip.image} 
                      alt={tip.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                    <p className="text-gray-400 mb-3">By {tip.author}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {tip.likes}
                      </span>
                      <Link 
                        to={`/tips/${index}`} 
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/cookingTips" 
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg transition-all inline-block"
            >
              View All Tips
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Share Your Culinary Knowledge</h2>
              <p className="text-xl mb-8 text-gray-200">
                Have a cooking trick that saves time? A special technique that elevates your dishes? Share it with our community and help others improve their cooking skills
              </p>
              <Link 
                to="/addtip" 
                className="px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 inline-block"
              >
                Share Your Tip Today
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TipsLanding;