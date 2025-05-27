import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataset } from '../../utils/data';
import LoadingSpinner from '../LoadingSpinner';

// List of possible interests (should match your dataset)
const INTERESTS = ['cooking', 'hiking', 'movies', 'music', 'reading', 'sports', 'travel'];

// Helper to reconstruct interests array from one-hot columns
function getUserInterests(user: any) {
  return INTERESTS.filter(interest => user[interest] === 1 || user[interest] === 1.0);
}
// Helper to map gender from 0/1 to string
function getUserGender(user: any) {
  // Handles 0/1, "male"/"female", "Male"/"Female"
  if (user.gender === 0 || (typeof user.gender === 'string' && user.gender.toLowerCase() === 'male')) return 'male';
  return 'female';
}

// New: Avatar component using randomuser.me
const ProfileAvatar: React.FC<{ gender: string }> = ({ gender }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setAvatarUrl(null); // reset while loading
    fetch(`https://randomuser.me/api/?gender=${gender}`)
      .then(res => res.json())
      .then(data => setAvatarUrl(data.results[0].picture.large));
  }, [gender]);

  if (!avatarUrl) return <div className="w-24 h-24 bg-gray-200 rounded-full" />;
  return <img src={avatarUrl} alt="Profile avatar" className="w-full h-full object-cover rounded-full" />;
};

const ProfileExplorer: React.FC = () => {
  const { data, loading, error } = useDataset();
  const [currentProfile, setCurrentProfile] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showMatch, setShowMatch] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;

  const filteredData = data.filter(profile => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'male') return getUserGender(profile) === 'male';
    if (selectedFilter === 'female') return getUserGender(profile) === 'female';
    return profile['looking_for'] === selectedFilter;
  });

  const currentUser = filteredData[currentProfile % filteredData.length];

  // Animate out, then advance profile
  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === 'right') {
        // 30% chance to show "It's a match!"
        if (Math.random() < 0.3) {
          setShowMatch(true);
          setTimeout(() => setShowMatch(false), 1800);
        }
      }
      setCurrentProfile(prev => prev + 1);
      setSwipeDirection(null);
    }, 350); // match exit animation duration
  };

  return (
    <div className="min-h-[500px] bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 rounded-3xl border border-purple-100 shadow-2xl backdrop-blur-md p-8 flex flex-col items-center">
      <div className="flex justify-between items-center mb-6 w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-purple-700 drop-shadow">Explore Dating Profiles</h2>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-purple-200"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Profiles</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="Marriage">Looking for Marriage</option>
            <option value="Long-term Relationship">Long-term Relationship</option>
            <option value="Casual Dating">Casual Dating</option>
          </select>
        </div>
      </div>

      {showMatch && (
        <div className="flex justify-center w-full mb-4">
          <div className="bg-pink-100 border-2 border-pink-300 text-pink-700 text-2xl font-extrabold px-8 py-4 rounded-2xl shadow-lg animate-bounce">
            💖 It's a match!
          </div>
        </div>
      )}

      <div className="relative bg-white/90 rounded-2xl border border-purple-100 shadow-xl p-8 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={swipeDirection === 'right' ? { x: 500, opacity: 0 } : swipeDirection === 'left' ? { x: -500, opacity: 0 } : { x: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <div className="flex flex-col space-y-6">
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-100 border-4 border-purple-200 shadow-lg">
                    {/* Use the new ProfileAvatar component */}
                    <ProfileAvatar gender={getUserGender(currentUser)} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">{getUserGender(currentUser) === 'male' ? 'Male' : 'Female'}, {currentUser.age}</h3>
                    <p className="text-gray-600">{currentUser.occupation}</p>
                  </div>
                </div>
                <div className="text-sm text-purple-600 font-semibold">
                  {currentUser['looking_for']}
                </div>
              </div>

              {/* Interests Section */}
              <div>
                <h4 className="font-medium mb-2 text-purple-700">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {getUserInterests(currentUser).map((interest, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm shadow-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* App Usage Section */}
              <div>
                <h4 className="font-medium mb-2 text-purple-700">App Usage</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-600">Swiping history</p>
                    <p className="text-lg font-semibold text-purple-800">{currentUser.swiping_history}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Usage frequency</p>
                    <p className="text-lg font-semibold text-purple-800">{currentUser.usage_frequency}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => handleSwipe('left')}
                  className="px-8 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="px-8 py-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                >
                  Like
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center w-full max-w-2xl">
        <p>Explore real user profiles from our dataset. Use filters to focus on specific demographics or relationship goals.</p>
      </div>
    </div>
  );
};

export default ProfileExplorer; 