import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { motion } from 'framer-motion';
import { useAggregates, relationshipGoalsArray } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

// Nivo's paired color scheme (first 4 colors)
const pairedColors = [
  '#a6cee3', // Casual Dating
  '#1f78b4', // Long-term Relationship
  '#b2df8a', // Friendship
  '#33a02c', // Marriage
];

const RelationshipGoals: React.FC = () => {
  const { aggregates, loading, error } = useAggregates();
  const goalsData = relationshipGoalsArray(aggregates);
  const pieData = goalsData.map(({ goal, count }, idx) => ({
    id: goal,
    label: goal,
    value: Number(count),
    color: pairedColors[idx % pairedColors.length], // assign color
  }));

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;

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
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={pairedColors}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          motionConfig="gentle"
          // Remove legends prop!
        />
      </div>
      {/* Custom Legend */}
      <div className="flex justify-center gap-8 mt-6 flex-wrap">
        {pieData.map((d, idx) => (
          <div key={d.id} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: pairedColors[idx % pairedColors.length] }}
            />
            <span className="text-gray-700 font-medium">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Distribution of users' relationship goals on the platform.</p>
      </div>
    </motion.div>
  );
};

export default RelationshipGoals;