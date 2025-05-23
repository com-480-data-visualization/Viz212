import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';
import { useAggregates, ageDistributionArray } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

const AgeDistribution: React.FC = () => {
  const { aggregates, loading, error } = useAggregates();
  const ageData = ageDistributionArray(aggregates).map(({ age, count }) => ({ age, count: Number(count) }));
  const totalUsers = ageData.reduce((sum, group) => sum + group.count, 0);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Age Distribution</h2>
          <p className="text-gray-600 mt-1">Total users: {totalUsers}</p>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveBar
          data={ageData}
          keys={['count']}
          indexBy="age"
          margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={["#4F46E5"]}
          borderRadius={4}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Age Group',
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Users',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          enableLabel={true}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[]}
          role="application"
          ariaLabel="Age distribution"
          barAriaLabel={e=>e.id+": "+e.formattedValue+" in age group: "+e.indexValue}
          motionConfig="gentle"
          tooltip={({ id, value, indexValue }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
              <div>Age: {indexValue}</div>
              <div>Count: {value}</div>
            </div>
          )}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Distribution of users across different age groups. Hover over bars for details.</p>
      </div>
    </motion.div>
  );
};

export default AgeDistribution; 