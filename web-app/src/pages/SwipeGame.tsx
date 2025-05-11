import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataset } from '../utils/data';
import { generateStatement, calculateScore, GameStatement, getCategoryColor } from '../utils/gameUtils';
import LoadingSpinner from '../components/LoadingSpinner';
import confetti from 'canvas-confetti';

const SwipeGame: React.FC = () => {
  const { data, loading, error } = useDataset();
  const [currentStatement, setCurrentStatement] = useState<GameStatement | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [categoryStats, setCategoryStats] = useState<{ [key: string]: { correct: number; total: number } }>({});
  const [showStats, setShowStats] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Initialize game
  useEffect(() => {
    if (data.length > 0) {
      setCurrentStatement(generateStatement(data));
    }
  }, [data]);

  // Handle swipe with visual feedback
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (!currentStatement) return;

    setSwipeDirection(direction);
    const isCorrect = (direction === 'right') === currentStatement.isTrue;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        // Trigger confetti for streaks of 3 or more
        if (newStreak >= 3) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    
    setTotalQuestions(prev => prev + 1);

    // Update category stats
    setCategoryStats(prev => {
      const category = currentStatement.category;
      const current = prev[category] || { correct: 0, total: 0 };
      return {
        ...prev,
        [category]: {
          correct: current.correct + (isCorrect ? 1 : 0),
          total: current.total + 1
        }
      };
    });

    setShowExplanation(true);

    // Move to next statement after a delay
    setTimeout(() => {
      setShowExplanation(false);
      setSwipeDirection(null);
      if (totalQuestions < 9) { // 10 questions total
        setCurrentStatement(generateStatement(data));
      } else {
        setGameOver(true);
      }
    }, 2000);
  }, [currentStatement, data, totalQuestions]);

  // Reset game
  const resetGame = useCallback(() => {
    setScore(0);
    setTotalQuestions(0);
    setGameOver(false);
    setStreak(0);
    setMaxStreak(0);
    setCategoryStats({});
    setCurrentStatement(generateStatement(data));
  }, [data]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, handleSwipe]);

  // Handle drag gestures
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: any) => {
    setCardPosition({ x: info.point.x, y: info.point.y });
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
    setCardPosition({ x: 0, y: 0 });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Swipe the Stats
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Swipe right if you think the statement is true, left if you think it's false!
          <br />
          <span className="text-sm text-gray-500">(Use arrow keys ← →, swipe, or click the buttons)</span>
        </p>

        {/* Game Stats */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-purple-600">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-2xl font-bold text-purple-600">{totalQuestions}/10</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-green-600">{streak}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Best Streak</p>
              <p className="text-2xl font-bold text-blue-600">{maxStreak}</p>
            </div>
          </div>
        </div>

        {/* Game Card */}
        <AnimatePresence mode="wait">
          {!gameOver ? (
            <motion.div
              key="game-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              style={{
                x: cardPosition.x,
                y: cardPosition.y,
                rotate: cardPosition.x * 0.1,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-8">
                {currentStatement && (
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getCategoryColor(currentStatement.category)}`}>
                    {currentStatement.category.charAt(0).toUpperCase() + currentStatement.category.slice(1)}
                  </div>
                )}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  {currentStatement?.statement}
                </h2>

                {/* Swipe Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleSwipe('left')}
                    className={`px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105
                      ${swipeDirection === 'left' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                  >
                    False
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    className={`px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105
                      ${swipeDirection === 'right' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                  >
                    True
                  </button>
                </div>

                {/* Explanation */}
                {showExplanation && currentStatement && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-gray-700">{currentStatement.explanation}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game-over"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
              <p className="text-xl text-gray-600 mb-6">
                Your final score: {calculateScore(score, totalQuestions)}%
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Best streak: {maxStreak} correct answers in a row!
              </p>
              
              {/* Category Stats */}
              <div className="mb-6">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  {showStats ? 'Hide' : 'Show'} Category Stats
                </button>
                {showStats && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(categoryStats).map(([category, stats]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-sm ${getCategoryColor(category)}`}>
                          {category}
                        </span>
                        <span className="text-gray-600">
                          {Math.round((stats.correct / stats.total) * 100)}% correct
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={resetGame}
                className="px-8 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwipeGame; 