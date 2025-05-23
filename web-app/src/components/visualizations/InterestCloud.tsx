import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAggregates } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

// Helper to format interests distribution from aggregates
const interestDistributionArray = (aggregates: any) =>
  aggregates && aggregates.interest_distribution
    ? Object.entries(aggregates.interest_distribution).map(([interest, stats]: [string, any]) => ({
        interest,
        count: Number(stats.count),
        byGender: stats.byGender || { male: 0, female: 0 }
      }))
    : [];

const InterestCloud: React.FC = () => {
  const { aggregates, loading, error } = useAggregates();
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const interestsData = interestDistributionArray(aggregates);
  const maxCount = interestsData.length > 0 ? Math.max(...interestsData.map(d => d.count)) : 1;

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Interests</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {interestsData.map(({ interest, count, byGender }) => {
          const fontSize = 14 + (count / maxCount) * 24; // Scale font size between 14px and 38px
          const opacity = 0.5 + (count / maxCount) * 0.5; // Scale opacity between 0.5 and 1
          return (
            <motion.div
              key={interest}
              className={`cursor-pointer px-3 py-1 rounded-full transition-colors
                ${selectedInterest === interest 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}
              style={{
                fontSize: `${fontSize}px`,
                opacity
              }}
              onClick={() => setSelectedInterest(interest === selectedInterest ? null : interest)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {interest}
            </motion.div>
          );
        })}
      </div>

      {/* Interest Details */}
      {selectedInterest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {selectedInterest}
          </h3>
          {interestsData
            .filter(d => d.interest === selectedInterest)
            .map(({ count, byGender }) => (
              <div key="details" className="space-y-2">
                <p className="text-gray-600">
                  Total users: {count}
                </p>
                <div className="flex gap-4">
                  <p className="text-indigo-600">Male: {byGender.male}</p>
                  <p className="text-rose-600">Female: {byGender.female}</p>
                </div>
              </div>
            ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default InterestCloud; 