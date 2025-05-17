import React from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaUtensils, FaFireAlt, FaLightbulb, FaArrowRight, FaStar, FaQuoteLeft } from "react-icons/fa";
import { IoWaterOutline } from "react-icons/io5";
import { FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, bgImage, linkTo }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className="bg-gray-900 p-6 rounded-2xl shadow-xl overflow-hidden relative group border border-gray-800"
  >
    <div 
      className="absolute inset-0 bg-cover bg-center z-0 opacity-10 group-hover:opacity-15 transition-opacity duration-500"
      style={{ backgroundImage: `url(${bgImage})` }}
    ></div>
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="p-4 rounded-full bg-blue-900 text-blue-400">
        <Icon className="text-3xl" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-sm text-center">{description}</p>
      <Link to={linkTo || "#"} className="mt-2 text-blue-400 font-medium flex items-center hover:text-blue-300 transition-colors">
        Learn more <FaArrowRight className="ml-2 text-sm" />
      </Link>
    </div>
  </motion.div>
);

const TestimonialCard = ({ content, author, role, image }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gray-900 p-8 rounded-2xl shadow-xl relative border border-gray-800"
  >
    <FaQuoteLeft className="absolute top-6 left-6 text-blue-900 text-4xl opacity-50" />
    <div className="flex flex-col items-center text-center">
      <img 
        src={image} 
        alt={author}
        className="w-20 h-20 rounded-full object-cover mb-6 ring-4 ring-blue-900"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?q=80&auto=format';
        }}
      />
      <p className="text-gray-300 italic mb-4 relative z-10">{content}</p>
      <div>
        <h4 className="font-bold text-white">{author}</h4>
        <p className="text-sm text-blue-400">{role}</p>
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  return (
    <div className="bg-black text-gray-100">
      {/* Hero Section with Dark Blue Background Image */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/public/images/dark-cooking-hero.jpg" 
            alt="Professional cooking"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&auto=format&fit=crop&w=1200';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black to-blue-900/60"></div>
        </div>
        
        {/* Floating food images */}
    
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="px-4 py-1 bg-blue-900/80 text-blue-300 rounded-full text-sm font-medium inline-block mb-4 backdrop-blur-sm">
                Welcome to YUMMY
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Cook. Connect. <span className="text-blue-400">Elevate</span> Your Culinary Journey.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                Join a community of food enthusiasts on a path to culinary excellence. Discover new recipes, track your nutrition, and master the art of cooking.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition shadow-lg hover:shadow-blue-500/30 flex items-center"
                >
                  Get Started
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/landing-page"
                  className="bg-gray-900 border border-blue-500 text-blue-400 px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
                >
                  Explore Recipes
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-[10%] right-[10%] w-32 h-32 bg-blue-600 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-[15%] left-[5%] w-24 h-24 bg-blue-400 rounded-full opacity-10 blur-xl"></div>
      </section>

      {/* Image gallery strip with dark themed images */}
      <section className="overflow-hidden py-12 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-4 animate-scroll">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="flex-none w-80 h-56 rounded-xl overflow-hidden shadow-md">
                <img 
                  src={`/public/images/dark-gallery${num}.jpg`}
                  alt={`Food gallery ${num}`}
                  className="w-full h-full object-cover hover:scale-110 transition duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://source.unsplash.com/featured/?dark,food,elegant,${num}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-200px * 3)); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}</style>
      </section>

      {/* Features Section with Dark Images */}
      <section className="py-24 px-6 max-w-6xl mx-auto bg-black">
        <div className="text-center mb-16">
          <span className="px-4 py-1 bg-blue-900/80 text-blue-300 rounded-full text-sm font-medium inline-block mb-3">
            PLATFORM FEATURES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Everything You Need in One Place
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Our platform combines recipe management, nutrition tracking, and cooking challenges to help you on your culinary journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={FaHeartbeat}
            title="Nutrition Tracking"
            description="Track your meals, calories, water, and progress with charts and reminders."
            bgImage="/public/images/dark-nutrition.jpg"
            linkTo="/nutrition"
          />
          <FeatureCard
            icon={FaUtensils}
            title="Share Recipes"
            description="Create, edit, and share your favorite dishes with the community."
            bgImage="/public/images/dark-recipes.jpg"
            linkTo="/landing-page"
          />
          <FeatureCard
            icon={FaFireAlt}
            title="Cooking Challenges"
            description="Participate in themed cooking contests and climb the leaderboard."
            bgImage="/public/images/dark-challenges.jpg"
            linkTo="/challenge-landing"
          />
          <FeatureCard
            icon={FaLightbulb}
            title="Kitchen Hacks"
            description="Discover daily tips and tricks to make your cooking smarter."
            bgImage="/public/images/dark-tips.jpg"
            linkTo="/cookingTips"
          />
        </div>
      </section>

      {/* Featured Recipes Section with dark themed images */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-1 bg-blue-900/80 text-blue-300 rounded-full text-sm font-medium inline-block mb-3">
              TASTE THE DIFFERENCE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Featured Recipes
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Explore our most popular recipes curated by professional chefs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Pan-Seared Sea Bass",
                image: "/public/images/dark-recipe1.jpg",
                fallback: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&auto=format&fit=crop&w=500",
                rating: 4.9,
                reviews: 124,
                time: "25 mins"
              },
              {
                title: "Black Truffle Risotto",
                image: "/public/images/dark-recipe2.jpg",
                fallback: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&auto=format&fit=crop&w=500",
                rating: 4.8,
                reviews: 98,
                time: "35 mins"
              },
              {
                title: "Matcha Green Tea Cake",
                image: "/public/images/dark-recipe3.jpg",
                fallback: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&auto=format&fit=crop&w=500",
                rating: 4.7,
                reviews: 86,
                time: "50 mins"
              }
            ].map((recipe, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg group border border-gray-800"
              >
                <div className="h-60 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = recipe.fallback;
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-blue-400">{recipe.time}</span>
                    <div className="flex items-center">
                      <FaStar className="text-blue-500 mr-1" />
                      <span className="text-sm font-medium text-gray-300">{recipe.rating} ({recipe.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{recipe.title}</h3>
                  <Link 
                    to="/landing-page" 
                    className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors"
                  >
                    View Recipe
                    <FaArrowRight className="ml-2 text-sm" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/landing-page"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition shadow-lg"
            >
              Browse All Recipes
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tip of the Day with Dark Blue Image */}
      <section className="relative py-16 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 to-blue-900/30"></div>
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover bg-center -z-10 opacity-10"
          style={{ backgroundImage: "url('/public/images/dark-herbs.jpg')" }}
        ></div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-blue-700 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute top-10 right-1/4 w-16 h-16 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
        
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="px-4 py-1 bg-blue-900/80 text-blue-300 rounded-full text-sm font-medium inline-block mb-3">
                DAILY INSPIRATION
              </span>
              <h3 className="text-3xl font-bold mb-4 text-white">💡 Tip of the Day</h3>
              <div className="p-6 bg-gray-900 rounded-2xl shadow-md border-l-4 border-blue-500 relative">
                <div className="absolute -right-4 -top-4">
                  <img 
                    src="/public/images/dark-chef-hat.png"
                    alt="Chef hat"
                    className="w-16 h-16 object-contain opacity-20"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://cdn-icons-png.flaticon.com/512/1096/1096118.png';
                    }}
                  />
                </div>
                <p className="text-gray-300 text-lg italic">
                  "When searing meat, ensure the pan is hot before adding oil. This gives you a perfect crust while keeping the inside juicy."
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-blue-400 font-medium">Chef Alexander</span>
                  <Link to="/cookingTips" className="text-gray-400 hover:text-blue-400 transition-colors">
                    See more tips →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with dark themed images */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-1 bg-blue-900/80 text-blue-300 rounded-full text-sm font-medium inline-block mb-3">
              SUCCESS STORIES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What Our Community Says
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Real people, real results - discover how our platform has transformed lives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              content="This app has completely changed my relationship with cooking. The recipes are easy to follow, and the nutrition tracking keeps me accountable."
              author="Sarah Johnson"
              role="Home Cook"
              image="/public/images/dark-testimonial1.jpg" 
            />
            <TestimonialCard 
              content="As a fitness enthusiast, I love how the app helps me monitor my nutrition while still enjoying delicious meals. The challenges are super fun!"
              author="Michael Rivera"
              role="Fitness Trainer"
              image="/public/images/dark-testimonial2.jpg" 
            />
            <TestimonialCard 
              content="The recipe management system is intuitive and powerful. I can organize all my family recipes and access them anywhere. Absolutely love it!"
              author="Emily Chen"
              role="Food Blogger"
              image="/public/images/dark-testimonial3.jpg" 
            />
          </div>
        </div>
      </section>

      {/* Progress Tracker Preview with Dark Blue UI */}
      <section className="py-24 px-6 relative bg-gray-950">
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-blue-900 rounded-full opacity-10 blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-800 rounded-full opacity-10 blur-3xl -z-10"></div>
        
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <span className="px-4 py-1 bg-blue-900/80 text-blue-300 rounded-full text-sm font-medium inline-block mb-3">
                NUTRITION TRACKING
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Track Your Health Goals</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Visualize your calorie and water intake, stay motivated, and celebrate milestones!
              </p>
              <ul className="space-y-4 mb-8">
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-blue-900 p-2 rounded-full">
                    <FiTrendingUp className="text-blue-300" />
                  </div>
                  <span className="text-gray-300">Track your daily progress with beautiful charts</span>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-blue-900 p-2 rounded-full">
                    <IoWaterOutline className="text-blue-300" />
                  </div>
                  <span className="text-gray-300">Monitor your water intake with reminders</span>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-blue-900 p-2 rounded-full">
                    <FaHeartbeat className="text-blue-300" />
                  </div>
                  <span className="text-gray-300">Get insights about your nutrition habits</span>
                </motion.li>
              </ul>
              <Link
                to="/nutrition"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition inline-flex items-center shadow-lg"
              >
                Start Tracking
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-blue-900 rounded-3xl rotate-3 opacity-50"></div>
              <motion.img 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                src="/public/images/dark-dashboard.jpg"
                alt="Nutrition tracking dashboard" 
                className="relative z-10 rounded-2xl shadow-xl w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&auto=format&fit=crop';
                }}
              />
              
              {/* Floating notification */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -right-5 top-1/4 bg-gray-900 p-3 rounded-lg shadow-lg z-20 max-w-[140px] border border-gray-700"
              >
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <p className="font-medium text-white">Goal achieved!</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Daily water intake</p>
              </motion.div>
              
              {/* Floating stat card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -left-5 bottom-1/4 bg-gray-900 p-3 rounded-lg shadow-lg z-20 border border-gray-700"
              >
                <p className="text-xs text-gray-400">Weekly Progress</p>
                <p className="text-lg font-bold text-blue-400">+12.5%</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call to Action with Dark Blue Background */}
      <section className="relative py-20 text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/public/images/dark-cta-background.jpg" 
            alt="Dark culinary background"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-blue-900/70"></div>
        </div>
        
        {/* Floating food images */}
        <motion.div 
          initial={{ opacity: 0, rotate: -10 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-xl overflow-hidden shadow-xl rotate-6 hidden lg:block z-10"
        >
          <img 
            src="/public/images/dark-food3.jpg"
            alt="Elegant dish" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&auto=format&fit=crop';
            }}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, rotate: 10 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="absolute top-[30%] right-[15%] w-32 h-32 rounded-xl overflow-hidden shadow-xl -rotate-12 hidden lg:block z-10"
        >
          <img 
            src="/public/images/dark-food4.jpg"
            alt="Professional plating" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&auto=format&fit=crop';
            }}
          />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to elevate your culinary journey?</h3>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of food enthusiasts who are transforming their kitchen skills and health habits.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-8"
            >
              <Link
                to="/register"
                className="inline-block bg-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 text-white"
              >
                Join the Community
              </Link>
            </motion.div>
            <p className="text-gray-400 mt-6">
              Already a member? <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
            </p>
          </motion.div>
        </div>

        {/* Additional floating elements for visual interest */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-lg mx-auto z-0">
          <div className="absolute -bottom-10 left-10 w-20 h-20 bg-blue-800 rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute -top-20 right-10 w-20 h-20 bg-blue-400 rounded-full opacity-10 blur-xl"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
