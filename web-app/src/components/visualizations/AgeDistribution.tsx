import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';
import { useDataset, getAgeDistribution } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

const AgeDistribution: React.FC = () => {
  const { data, loading, error } = useDataset();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;
  
  const ageData = getAgeDistribution(data);
  const totalUsers = ageData.reduce((sum, group) => sum + group.male + group.female, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Age Distribution by Gender</h2>
          <p className="text-gray-600 mt-1">Total users: {totalUsers}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Male</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-rose-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Female</span>
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveBar
          data={ageData}
          keys={['male', 'female']}
          indexBy="age"
          margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#4F46E5', '#F43F5E']}
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
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          role="application"
          ariaLabel="Age distribution by gender"
          barAriaLabel={e=>e.id+": "+e.formattedValue+" in age group: "+e.indexValue}
          motionConfig="gentle"
          tooltip={({ id, value, indexValue }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
              <strong>{id === 'male' ? 'Male' : 'Female'}</strong>
              <div>Age: {indexValue}</div>
              <div>Count: {value}</div>
            </div>
          )}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Distribution of users across different age groups, split by gender. Hover over bars for details.</p>
      </div>
    </motion.div>
  );
};

export default AgeDistribution; 