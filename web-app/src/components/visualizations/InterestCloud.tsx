import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  'rgba(165, 180, 252, 0.5)', // indigo-200
  'rgba(249, 168, 212, 0.5)', // pink-300
  'rgba(252, 211, 77, 0.5)',  // yellow-300
  'rgba(110, 231, 183, 0.5)', // green-300
  'rgba(252, 165, 165, 0.5)', // red-300
  'rgba(253, 186, 116, 0.5)', // orange-300
  'rgba(103, 232, 249, 0.5)', // cyan-300
  'rgba(196, 181, 253, 0.5)', // purple-200
];

const BUBBLE_SIZE = 80;
const CONTAINER_WIDTH = 600;
const CONTAINER_HEIGHT = 350;

const InterestCloud: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    fetch('/data/interests.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setData(data);
        // Set initial positions
        setPositions(
          data.map((_: string, idx: number) => ({
            x: 30 + (idx % 5) * (BUBBLE_SIZE + 10),
            y: 30 + Math.floor(idx / 5) * (BUBBLE_SIZE + 10),
          }))
        );
      });
  }, []);

  if (!data || !Array.isArray(data) || positions.length !== data.length)
    return <div>Loading interests...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Popular Interests</h3>
      <div
        className="relative mx-auto"
        style={{
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT,
          border: '2px dashed #e5e7eb',
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {data.map((interest: string, idx: number) => (
          <motion.div
            key={idx}
            className="flex items-center justify-center rounded-full font-semibold transition-transform duration-200 hover:scale-110 select-none"
            drag
            dragMomentum={false}
            dragConstraints={{
              left: 0,
              top: 0,
              right: CONTAINER_WIDTH - BUBBLE_SIZE,
              bottom: CONTAINER_HEIGHT - BUBBLE_SIZE,
            }}
            dragElastic={0.7}
            whileTap={{ scale: 1.1 }}
            style={{
              width: BUBBLE_SIZE,
              height: BUBBLE_SIZE,
              fontSize: 16,
              background: COLORS[idx % COLORS.length],
              color: '#3b0764',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'grab',
              position: 'absolute',
              left: positions[idx].x,
              top: positions[idx].y,
              userSelect: 'none',
            }}
            onDragEnd={(_, info) => {
              let { x, y } = info.point;
              if (x < 0) x = 0;
              if (x > CONTAINER_WIDTH - BUBBLE_SIZE) x = CONTAINER_WIDTH - BUBBLE_SIZE;
              if (y < 0) y = 0;
              if (y > CONTAINER_HEIGHT - BUBBLE_SIZE) y = CONTAINER_HEIGHT - BUBBLE_SIZE;

              setPositions(pos =>
                pos.map((p, i) =>
                  i === idx
                    ? { x, y }
                    : p
                )
              );
            }}
          >
            {interest}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterestCloud; 