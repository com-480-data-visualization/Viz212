import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      title: "How old are users?",
      description: "Explore the age distribution of dating app users across different demographics.",
      comingSoon: true
    },
    {
      title: "What are people looking for?",
      description: "Discover the most common relationship goals and how they vary by age and gender.",
      comingSoon: true
    },
    {
      title: "Top Hobbies & Interests",
      description: "Explore the most popular interests and how they connect potential matches.",
      comingSoon: true
    },
    {
      title: "App Usage Patterns",
      description: "Analyze how frequently different user groups engage with the app.",
      comingSoon: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Who's on the App?
        </h1>
        <p className="text-xl text-gray-600">
          Discover fascinating insights about dating app users through interactive visualizations
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(index)}
          >
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {section.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {section.description}
              </p>
              {section.comingSoon && (
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 