import React, { useState } from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { useDataset } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

// Define types for our data
interface NetworkNode {
  id: string;
  value: number;
  color: string;
}

interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

const InterestNetwork: React.FC = () => {
  const { data, loading, error } = useDataset();
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [hoveredInterest, setHoveredInterest] = useState<string | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;

  // Process data to create network nodes and links
  const interests = Array.from(new Set(data.flatMap(user => user.interests)));
  
  // Calculate interest relationships (how many users share pairs of interests)
  const interestRelationships = new Map<string, Map<string, number>>();
  interests.forEach(interest1 => {
    const relationships = new Map<string, number>();
    interests.forEach(interest2 => {
      if (interest1 !== interest2) {
        const sharedUsers = data.filter(user => 
          user.interests.includes(interest1) && user.interests.includes(interest2)
        ).length;
        relationships.set(interest2, sharedUsers);
      }
    });
    interestRelationships.set(interest1, relationships);
  });

  const nodes: NetworkNode[] = [
    // Center node
    {
      id: 'center',
      value: 1,
      color: '#6366F1',
    },
    // Interest nodes
    ...interests.map(interest => ({
      id: interest,
      value: data.filter(user => user.interests.includes(interest)).length,
      color: selectedInterest === interest ? '#8B5CF6' : 
             hoveredInterest === interest ? '#818CF8' : '#A5B4FC',
    })),
  ];

  // Create links based on interest relationships
  const links: NetworkLink[] = [];
  
  // Add links from center to all interests
  interests.forEach(interest => {
    links.push({
      source: 'center',
      target: interest,
      value: data.filter(user => user.interests.includes(interest)).length,
    });
  });

  // Add links between related interests with strong connections
  interestRelationships.forEach((relationships, interest1) => {
    relationships.forEach((sharedUsers, interest2) => {
      // Only add links for interests with significant overlap (more than 20% of users)
      const threshold = Math.min(
        data.filter(u => u.interests.includes(interest1)).length,
        data.filter(u => u.interests.includes(interest2)).length
      ) * 0.2;
      
      if (sharedUsers > threshold) {
        links.push({
          source: interest1,
          target: interest2,
          value: sharedUsers,
        });
      }
    });
  });

  const networkData: NetworkData = {
    nodes,
    links,
  };

  // Calculate max value for node scaling
  const maxValue = Math.max(...nodes.map(node => node.value));
  const nodeScale = (value: number) => (value / maxValue) * 40 + 20;

  // Get relationship info for the selected/hovered interest
  const getRelationshipInfo = (interest: string) => {
    if (!interestRelationships.has(interest)) return [];
    
    const relationships = Array.from(interestRelationships.get(interest)!.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    return relationships;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Interest Network</h2>
          <p className="text-sm text-gray-600 mt-1">
            The size of each circle represents the number of users interested in that activity. 
            Interests are positioned closer together when more users share them as common interests.
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-2 py-1 text-sm rounded-lg border border-gray-300"
            value={selectedInterest || ''}
            onChange={(e) => setSelectedInterest(e.target.value || null)}
          >
            <option value="">All Interests</option>
            {interests.map(interest => (
              <option key={interest} value={interest}>{interest}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveNetwork
          data={networkData}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          linkDistance={120}
          centeringStrength={0.3}
          repulsivity={15}
          nodeSize={n => nodeScale(n.value)}
          activeNodeSize={n => nodeScale(n.value) * 1.2}
          nodeColor={node => node.color}
          nodeBorderWidth={2}
          nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
          linkThickness={1.5}
          linkColor={{ from: 'source.color', modifiers: [['opacity', 0.4]] }}
          motionConfig="gentle"
          onClick={(node) => {
            if (node.id !== 'center') {
              setSelectedInterest(selectedInterest === node.id ? null : node.id);
            }
          }}
          onMouseEnter={(node) => {
            if (node.id !== 'center') {
              setHoveredInterest(node.id);
            }
          }}
          onMouseLeave={() => setHoveredInterest(null)}
        />
      </div>

      <div className="mt-2">
        {(selectedInterest || hoveredInterest) && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-800">
              {selectedInterest || hoveredInterest}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {data.filter(user => user.interests.includes(selectedInterest || hoveredInterest!)).length} users
            </p>
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-700">Most common combinations:</p>
              <ul className="mt-1 space-y-1">
                {getRelationshipInfo(selectedInterest || hoveredInterest!).map(([interest, count]) => (
                  <li key={interest} className="text-sm text-gray-600">
                    • {interest}: {count} shared users
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {!selectedInterest && !hoveredInterest && (
          <p className="text-sm text-gray-600">
            Hover over or select an interest to see detailed information about its relationships with other interests.
          </p>
        )}
      </div>
    </div>
  );
};

export default InterestNetwork; 