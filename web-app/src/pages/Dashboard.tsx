import React from 'react';
import AgeDistribution from '../components/visualizations/AgeDistribution';
import RelationshipGoals from '../components/visualizations/RelationshipGoals';
import InterestCloud from '../components/visualizations/InterestCloud';
import UsagePatterns from '../components/visualizations/UsagePatterns';
import ProfileExplorer from '../components/visualizations/ProfileExplorer';
import InterestNetwork from '../components/visualizations/InterestNetwork';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dating App Insights</h1>
        
        <div className="flex flex-col gap-8">
          {/* Interactive Profile Explorer - Full Width */}
          <div>
            <ProfileExplorer />
          </div>

          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Age Distribution - Left */}
            <div className="flex flex-col">
              <AgeDistribution />
            </div>

            {/* Interest Network - Right */}
            <div className="flex flex-col">
              <InterestNetwork />
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* App Usage Patterns - Left */}
            <div className="flex flex-col h-full">
              <UsagePatterns />
            </div>

            {/* Relationship Goals - Right */}
            <div className="flex flex-col h-full">
              <RelationshipGoals />
            </div>
          </div>

          {/* Interest Cloud - Full Width */}
          <div>
            <InterestCloud />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 