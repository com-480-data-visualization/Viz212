import React from 'react';

const SwipeGame: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Swipe the Stats
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Swipe right if you think the statement is true, left if you think it's false!
        </p>
        {/* Game content will go here */}
      </div>
    </div>
  );
};

export default SwipeGame; 