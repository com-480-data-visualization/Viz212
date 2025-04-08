import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-left text-gray-800 mb-8">
          LoveLogic -- Where love meets logic and data
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Discover fascinating statistics about dating app behavior
        </p>
        <p className="text-2xl text-center text-gray-700 italic">
          Ready to find out what's waiting for you?
        </p>
      </div>
    </div>
  );
};

export default Home; 