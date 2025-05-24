import React, { useState } from 'react';
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
  return user.gender === 0 ? 'Male' : 'Female';
}

const ProfileExplorer: React.FC = () => {
  const { data, loading, error } = useDataset();
  const [currentProfile, setCurrentProfile] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data: {error}</div>;

  const filteredData = data.filter(profile => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'male') return getUserGender(profile) === 'Male';
    if (selectedFilter === 'female') return getUserGender(profile) === 'Female';
    return profile['looking_for'] === selectedFilter;
  });

  const currentUser = filteredData[currentProfile % filteredData.length];

  // Generate a consistent avatar based on user properties
  const getAvatarUrl = (user: any) => {
    const seed = `${getUserGender(user)}-${user.age}-${user.occupation}`;
    // Both genders use the same style for consistency, but with different options
    const style = 'adventurer-neutral';
    // Common options
    const commonOptions = [
      'backgroundColor=b6e3f4',
    ];
    // Gender-specific options
    const genderOptions = getUserGender(user) === 'Female' ? [
      'hair=long01,long02,long03,long04,long05,long06,long07,long08,long09,long10,long11,long12,long13,long14,long15,long16,long17,long18,long19,long20',
      'hairColor=0e0e0e,6a4e35,a55728,c93305,cb6820,911f27,e8e8e8,b9b9b9,9a9a9a,697a96,4a5568,8d5524',
      'accessoriesProbability=20',
      'accessories=glasses,glasses02,glasses03,glasses04,glasses05',
    ] : [
      'hair=short01,short02,short03,short04,short05,short06,short07,short08,short09,short10,short11,short12,short13,short14,short15',
      'hairColor=0e0e0e,6a4e35,a55728,c93305,cb6820,911f27,e8e8e8,b9b9b9,9a9a9a,697a96,4a5568,8d5524',
      'accessoriesProbability=30',
      'accessories=glasses,glasses02,glasses03,glasses04,glasses05',
    ];
    const allOptions = [...commonOptions, ...genderOptions].join('&');
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&${allOptions}`;
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setCurrentProfile(prev => prev + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Explore Dating Profiles</h2>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 rounded-lg border border-gray-300"
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

      <div className="relative bg-gray-50 rounded-lg p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="flex flex-col space-y-6">
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-100">
                    <img 
                      src={getAvatarUrl(currentUser)}
                      alt="Profile avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{getUserGender(currentUser)}, {currentUser.age}</h3>
                    <p className="text-gray-600">{currentUser.occupation}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {currentUser['looking_for']}
                </div>
              </div>

              {/* Interests Section */}
              <div>
                <h4 className="font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {getUserInterests(currentUser).map((interest, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* App Usage Section */}
              <div>
                <h4 className="font-medium mb-2">App Usage</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-600">Swiping history</p>
                    <p className="text-lg font-semibold">{currentUser.swiping_history}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Usage frequency</p>
                    <p className="text-lg font-semibold">{currentUser.usage_frequency}</p>
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

      <div className="mt-4 text-sm text-gray-600">
        <p>Explore real user profiles from our dataset. Use filters to focus on specific demographics or relationship goals.</p>
      </div>
    </div>
  );
};

export default ProfileExplorer; 