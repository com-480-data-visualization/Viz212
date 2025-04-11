import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { motion } from 'framer-motion';
import { useDataset, getRelationshipGoals } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

const RelationshipGoals: React.FC = () => {
  const { data, loading, error } = useDataset();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;
  
  const goalsData = getRelationshipGoals(data);
  const pieData = goalsData.map(({ goal, count }) => ({
    id: goal,
    label: goal,
    value: count
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Relationship Goals</h2>
      <div className="h-[400px]">
        <ResponsivePie
          data={pieData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'paired' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          motionConfig="gentle"
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle'
            }
          ]}
        />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Distribution of users' relationship goals on the platform.</p>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {goalsData.map(({ goal, byGender }) => (
            <div key={goal} className="flex justify-between items-center">
              <span className="font-medium">{goal}:</span>
              <span>
                M: {byGender.male} | F: {byGender.female}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RelationshipGoals; 