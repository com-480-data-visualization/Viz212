import React, { useEffect, useState, useRef } from 'react';
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

// Helper to get a random number in a range
const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const InterestCloud: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  // Each bubble: { x, y, vx, vy }
  const [bubbles, setBubbles] = useState<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const rafRef = useRef<number>();

  // Fetch interests and set initial positions/velocities
  useEffect(() => {
    fetch('/data/interests.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setData(data);
        setBubbles(
          data.map((_: string) => ({
            x: getRandom(0, CONTAINER_WIDTH - BUBBLE_SIZE),
            y: getRandom(0, CONTAINER_HEIGHT - BUBBLE_SIZE),
            vx: getRandom(-2, 2),
            vy: getRandom(-2, 2),
          }))
        );
      });
  }, []);

  // Animation loop for bouncing
  useEffect(() => {
    if (!bubbles.length) return;
    const animate = () => {
      setBubbles(prev =>
        prev.map(b => {
          let { x, y, vx, vy } = b;
          x += vx;
          y += vy;

          // Bounce off walls
          if (x <= 0 || x >= CONTAINER_WIDTH - BUBBLE_SIZE) vx *= -1;
          if (y <= 0 || y >= CONTAINER_HEIGHT - BUBBLE_SIZE) vy *= -1;

          // Clamp to bounds
          x = Math.max(0, Math.min(x, CONTAINER_WIDTH - BUBBLE_SIZE));
          y = Math.max(0, Math.min(y, CONTAINER_HEIGHT - BUBBLE_SIZE));

          return { x, y, vx, vy };
        })
      );
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [bubbles.length]);

  // Drag handler: update position and give new random velocity
  const handleDragEnd = (i: number, event: any, info: any) => {
    let { x, y } = info.point;
    if (x < 0) x = 0;
    if (x > CONTAINER_WIDTH - BUBBLE_SIZE) x = CONTAINER_WIDTH - BUBBLE_SIZE;
    if (y < 0) y = 0;
    if (y > CONTAINER_HEIGHT - BUBBLE_SIZE) y = CONTAINER_HEIGHT - BUBBLE_SIZE;
    setBubbles(prev =>
      prev.map((b, idx) =>
        idx === i
          ? { x, y, vx: getRandom(-2, 2), vy: getRandom(-2, 2) }
          : b
      )
    );
  };

  if (!data || !Array.isArray(data) || bubbles.length !== data.length)
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
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 16px 4px rgba(139,92,246,0.3)",
              zIndex: 2,
            }}
            whileTap={{
              scale: 1.15,
              boxShadow: "0 0 24px 8px rgba(139,92,246,0.5)",
              zIndex: 3,
            }}
            animate={{
              x: bubbles[idx].x,
              y: bubbles[idx].y,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: BUBBLE_SIZE,
              height: BUBBLE_SIZE,
              fontSize: 16,
              background: COLORS[idx % COLORS.length],
              color: '#3b0764',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'grab',
              position: 'absolute',
              userSelect: 'none',
            }}
            onDragEnd={(event, info) => handleDragEnd(idx, event, info)}
          >
            {interest}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterestCloud; 