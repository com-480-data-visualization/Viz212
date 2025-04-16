import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            LoveLogic
            <span className="block text-2xl mt-2 text-purple-600">
              Where Love Meets Data
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12">
          Think you’ve figured out dating apps? Let the data tell you what’s really going on...
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/swipe-game"
              className="inline-block bg-pink-100 text-purple-700 px-8 py-3 rounded-lg font-medium hover:bg-pink-200 transition-colors"
            >
              Try Swipe Game
            </Link>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "User Demographics",
              description: "Explore age distributions and preferences across different user groups"
            },
            {
              title: "Dating Goals",
              description: "Understand what people are looking for and how it varies by demographics"
            },
            {
              title: "Interest Patterns",
              description: "Discover the most popular hobbies and how they connect potential matches"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 * (index + 1) }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 