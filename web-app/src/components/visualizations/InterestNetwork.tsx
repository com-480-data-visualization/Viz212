import React, { useState } from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { motion } from 'framer-motion';
import { useInterestNetwork } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

const InterestNetwork: React.FC = () => {
  const { network, loading, error } = useInterestNetwork();
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;
  if (!network) return <div className="text-red-500">No network data available.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Interest Network</h2>
      <div className="h-[500px]">
        <ResponsiveNetwork
          data={network}
          linkDistance={e => 10 + (((e as any).value || 1))} // Lower base and multiplier
          centeringStrength={0.3}
          repulsivity={15}
          nodeSize={n => (n as any).value / 10}
          activeNodeSize={n => (n as any).value / 8}
          nodeColor={node => selectedInterest === node.id ? '#8B5CF6' : '#A5B4FC'}
          nodeBorderWidth={2}
          nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
          linkThickness={e => Math.max(1, (((e as any).value) || 1) / 2)}
          linkColor={{ from: 'source.color', modifiers: [['opacity', 0.4]] }}
          motionConfig="gentle"
          onClick={node => setSelectedInterest(node.id)}
          onMouseEnter={(node, event) => {
            setHoveredNode(node);
            setMousePos({ x: event.clientX, y: event.clientY });
          }}
          onMouseLeave={() => setHoveredNode(null)}
        />
        {hoveredNode && mousePos && (
          <div
            style={{
              position: 'fixed',
              top: mousePos.y + 10,
              left: mousePos.x + 10,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: '8px 12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              color: '#333',
              fontSize: 14,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            <strong>{hoveredNode.id}</strong>
            <br />
            Users: {hoveredNode.data?.value ?? hoveredNode.value ?? 'N/A'}
            <br />
            Top connections:
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {network.links
                .filter(l => l.source === hoveredNode.id || l.target === hoveredNode.id)
                .sort((a, b) => (b.value || 0) - (a.value || 0))
                .slice(0, 3)
                .map((l, i) => {
                  const other = l.source === hoveredNode.id ? l.target : l.source;
                  return (
                    <li key={i} style={{ fontSize: 13 }}>
                      {other}: {l.value}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-6 text-gray-700 text-base">
        <p>
          This network visualizes how users' interests are interconnected. Each node represents a popular interest, and links indicate how many users share both interests. The closer and thicker the link, the more users have both interests in common. Explore the network to discover which hobbies and activities tend to cluster together in the dating app community!
        </p>
      </div>
      {selectedInterest && (
        <div className="mt-4 text-sm text-gray-600">
          <strong>{selectedInterest}</strong> is connected to other interests.
        </div>
      )}
    </motion.div>
  );
};

export default InterestNetwork;