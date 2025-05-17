import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ChallengeLanding = () => {
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
            src="http://localhost:8080/uploads/challenges/masterchef-challenges-2.jpeg" 
            alt="Challenge background"
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
                  Join Exciting <span className="text-amber-400">Cooking Challenges</span>
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-100 font-medium bg-black bg-opacity-40 p-4 rounded-lg"
                >
                  Test your culinary skills and compete with others in fun and creative challenges.
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link 
                    to="/challenges" 
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                    Create Challenge
                  </Link>
                  <Link 
                    to="/challenges" 
                    className="px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-lg transition-all"
                  >
                    Explore Challenges
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChallengeLanding;
