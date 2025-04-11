import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';
import { useDataset, getUsagePatterns } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

const UsagePatterns: React.FC = () => {
  const { data, loading, error } = useDataset();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;
  
  const rawData = getUsagePatterns(data);
  const chartData = rawData.map(({ frequency, avgSwipes }) => ({
    frequency,
    avgSwipes: Math.round(avgSwipes * 10) / 10 // Round to 1 decimal place
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">App Usage Patterns</h2>
      <div className="h-[400px]">
        <ResponsiveBar
          data={chartData}
          keys={['avgSwipes']}
          indexBy="frequency"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#8B5CF6']} // Purple
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Usage Frequency',
            legendPosition: 'middle',
            legendOffset: 40
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Average Swipes per Session',
            legendPosition: 'middle',
            legendOffset: -50
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          motionConfig="gentle"
          role="application"
        />
      </div>

      {/* Usage Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {rawData.map(({ frequency, count, byGender }) => (
          <div key={frequency} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">{frequency}</h3>
            <div className="space-y-1">
              <p className="text-gray-600">Total users: {count}</p>
              <div className="flex gap-4">
                <p className="text-indigo-600">Male: {byGender.male}</p>
                <p className="text-rose-600">Female: {byGender.female}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default UsagePatterns; 