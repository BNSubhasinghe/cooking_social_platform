import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaUtensils, FaLightbulb, FaTrophy, FaHeart } from "react-icons/fa";
import { IoRestaurant, IoNutrition, IoPeople } from "react-icons/io5";

const AboutPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Preload critical images
  useEffect(() => {
    const preloadImages = [
      'https://images.unsplash.com/photo-1556910103-1c02745adc4b?q=80&auto=format&fit=crop',
      
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Platform features
  const features = [
    {
      icon: <FaUtensils className="text-3xl" />,
      title: "Recipe Sharing",
      description: "Discover, create and share your favorite recipes with our community. Save collections, add personal notes, and customize ingredients to fit your dietary needs.",
      image: "/public/images/about/recipe-feature.jpg",
      fallback: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&auto=format&fit=crop&w=500",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <IoNutrition className="text-3xl" />,
      title: "Nutrition Tracking",
      description: "Monitor your daily nutrition with our comprehensive tracking tools. Set goals, track calories, water intake, and macronutrients with intuitive charts and reminders.",
      image: "/public/images/about/nutrition-feature.jpg",
      fallback: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&auto=format&fit=crop&w=500",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <FaLightbulb className="text-3xl" />,
      title: "Cooking Tips & Tricks",
      description: "Learn kitchen hacks and techniques from seasoned chefs and community members. Improve your culinary skills with our daily tips and tutorial collections.",
      image: "/public/images/about/tips-feature.jpg",
      fallback: "https://images.unsplash.com/photo-1556911073-a517e752729c?q=80&auto=format&fit=crop&w=500",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: <FaTrophy className="text-3xl" />,
      title: "Cooking Challenges",
      description: "Participate in weekly cooking competitions to test your skills, get creative with themed challenges, and climb our community leaderboard.",
      image: "/public/images/about/challenge-feature.jpg",
      fallback: "https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?q=80&auto=format&fit=crop&w=500",
      color: "from-pink-500 to-rose-500"
    }
  ];

  // Platform values
  const values = [
    {
      icon: <IoPeople className="w-7 h-7" />,
      title: "Community-Driven",
      description: "Our platform thrives on user interactions, feedback, and contributions."
    },
    {
      icon: <FaLeaf className="w-7 h-7" />,
      title: "Health-Focused",
      description: "We prioritize nutritional education and balanced approaches to eating."
    },
    {
      icon: <FaHeart className="w-7 h-7" />,
      title: "Inclusive",
      description: "Recipes and guidance for all dietary preferences and skill levels."
    }
  ];

  // Community images
  const communityImages = [
    {
      src: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800&auto=format&fit=crop",
      alt: "Community cooking class",
      span: "md:col-span-2 md:row-span-2"
    },
    {
      src: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?q=80&w=600&auto=format&fit=crop",
      alt: "Recipe sharing"
    },
    {
      src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop",
      alt: "Food photography"
    },
    {
      src: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?q=80&w=800&auto=format&fit=crop",
      alt: "Challenge participation",
      span: "md:col-span-2"
    },
    {
      src: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=600&auto=format&fit=crop",
      alt: "Nutrition tracking"
    },
    {
      src: "https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=600&auto=format&fit=crop",
      alt: "Community event"
    }
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center py-20 md:py-28 overflow-hidden">
  {/* Background layers with purple gradient */}
  <div className="absolute inset-0 z-0">
    <div 
      className="absolute inset-0 bg-cover bg-center bg-gradient-to-br from-indigo-700 to-blue-800"
    ></div>
    <div className="absolute inset-0 opacity-40">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#smallGrid)" />
      </svg>
    </div>
  </div>
  
  {/* Animated particles */}
  <div className="absolute inset-0 z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 5 + 3}px`,
          height: `${Math.random() * 5 + 3}px`,
          backgroundColor: Math.random() > 0.5 ? 'rgba(255,255,255,0.4)' : 'rgba(200,210,255,0.3)',
        }}
        animate={{
          y: [0, Math.random() * -100 - 50],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 15,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
  
  {/* Content container */}
  <div className="container mx-auto px-8 relative z-10">
    <div className="flex flex-col lg:flex-row items-center">
      {/* Left content - Text */}
      <div className="lg:w-7/12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-white/10 backdrop-blur-md p-10 md:p-12 rounded-3xl border border-white/20 shadow-xl"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="px-5 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium inline-block mb-6"
          >
            ABOUT YUMMY
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
          >
            Where Food Meets <span className="text-blue-200">Community</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-blue-50 mb-8 leading-relaxed"
          >
            We're building a world where cooking becomes a shared experience, nutrition becomes achievable, and culinary expertise becomes accessible to everyone.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: "#4263eb" }}
              whileTap={{ scale: 0.98 }}
              href="/register"
              className="px-8 py-4 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition shadow-lg flex items-center justify-center"
            >
              Join Our Community
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
              whileTap={{ scale: 0.98 }}
              href="/landing-page"
              className="px-8 py-4 bg-white/10 text-white border border-white/30 font-medium rounded-xl hover:bg-white/20 transition shadow-lg backdrop-blur-sm"
            >
              Explore Recipes
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right content - Floating images */}
      <div className="lg:w-5/12 relative h-[400px] mt-12 lg:mt-0">
        <motion.div 
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="absolute right-[15%] top-[10%] w-48 h-48 rounded-2xl overflow-hidden shadow-2xl z-20"
        >
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"
            alt="Prepared dish"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop";
            }}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute left-[10%] top-[30%] w-36 h-36 rounded-xl overflow-hidden shadow-2xl z-10"
        >
          <img 
            src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=300&auto=format&fit=crop"
            alt="Recipe book"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute left-[25%] bottom-[10%] w-40 h-40 rounded-full overflow-hidden shadow-2xl z-30"
        >
          <img 
            src="https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?q=80&w=300&auto=format&fit=crop"
            alt="Cooking process"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-indigo-400 rounded-full opacity-15 blur-2xl"></div>
      </div>
    </div>
  </div>
  
  {/* Decorative dots */}
  <div className="absolute top-20 right-[15%] w-3 h-3 bg-blue-200 rounded-full"></div>
  <div className="absolute bottom-32 left-[25%] w-2 h-2 bg-blue-200 rounded-full"></div>
  <div className="absolute top-1/2 left-[10%] w-4 h-4 bg-blue-200 rounded-full opacity-30"></div>
</section>

      {/* Our Mission */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium inline-block mb-4">
                OUR MISSION
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Bringing People Together Through Food
              </h2>
              <div className="prose prose-lg">
                <p>
                  At YUMMY, we believe cooking should be enjoyable, accessible, and community-driven. Our platform combines recipe sharing, nutrition tracking, cooking challenges, and culinary tips to create a holistic food experience.
                </p>
                <p>
                  We're building a place where food enthusiasts can connect, share their passion, improve their skills, and achieve their health goals—all within a supportive community environment.
                </p>
                <p>
                  Whether you're a seasoned chef or just starting your culinary journey, our platform provides the tools, resources, and community you need to thrive in the kitchen and beyond.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl rotate-3"></div>
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src="/images/about/mission.jpg" 
                  alt="People cooking together" 
                  className="rounded-lg relative z-10 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1556910636-711d5706834a?q=80&auto=format&fit=crop';
                  }}
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Core Values */}
      {/* <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium inline-block mb-4">
              OUR VALUES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              What We Stand For
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              These core principles guide our development and community engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <div className="bg-blue-100 p-3 rounded-xl inline-flex mb-6 text-blue-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium inline-block mb-4">
              OUR PLATFORM
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              What Makes YUMMY Special
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Discover our core features designed to enhance your culinary journey and health goals
            </p>
          </div>
          
          <div className="space-y-24 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 items-center`}
              >
                <div className="md:w-1/2">
                  <div className={`bg-gradient-to-r ${feature.color} p-1 rounded-xl`}>
                    <div className="bg-white p-1 rounded-lg">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="rounded-lg w-full h-80 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = feature.fallback;
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700 mb-6 text-lg">{feature.description}</p>
                  
                  <ul className="space-y-3">
                    {[1, 2, 3].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`}></div>
                        <span className="text-gray-600">
                          {feature.title === "Recipe Sharing" && 
                            ["Create and share custom recipes", "Save favorites and build collections", "Rate and review community recipes"][idx]}
                          {feature.title === "Nutrition Tracking" && 
                            ["Track daily calories and macros", "Set and monitor health goals", "Get personalized nutrition insights"][idx]}
                          {feature.title === "Cooking Tips & Tricks" && 
                            ["Learn techniques from experts", "Discover ingredient substitutions", "Access step-by-step guides"][idx]}
                          {feature.title === "Cooking Challenges" && 
                            ["Join weekly themed competitions", "Win badges and climb leaderboards", "Improve skills with feedback"][idx]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10k+", label: "Active Users" },
              { number: "5k+", label: "Shared Recipes" },
              { number: "200+", label: "Cooking Challenges" },
              { number: "1000+", label: "Cooking Tips" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mt-3 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Showcase */}
      <section className="py-20">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium inline-block mb-4">
        OUR COMMUNITY
      </span>
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
        Created By Food Lovers, For Food Lovers
      </h2>
      <p className="text-gray-700 max-w-3xl mx-auto">
        Join a thriving community of cooking enthusiasts sharing their passion for food
      </p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {communityImages.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className={`overflow-hidden rounded-xl shadow-md ${image.span || ""}`}
        >
          <img 
            src={image.src} 
            alt={image.alt}
            className="w-full h-full object-cover hover:scale-110 transition duration-700"
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Join CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mx-6 my-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Ready to Start Your Culinary Journey?
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Join thousands of food enthusiasts who are discovering recipes, tracking nutrition, and participating in cooking challenges.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  href="/register"
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-lg"
                >
                  Join for Free
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  href="/login"
                  className="px-8 py-3 bg-white text-blue-700 border border-blue-200 font-medium rounded-lg hover:bg-blue-50 transition shadow-lg"
                >
                  Sign In
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;