import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Dating App Insights
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Discover fascinating statistics about dating app behavior
        </p>
        <div className="flex justify-center">
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full transition duration-300">
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 