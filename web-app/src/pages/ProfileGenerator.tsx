import React, { useState } from 'react';
import { useDataset } from '../utils/data';
import { useUserJourney } from '../context/UserJourneyContext';
// You can reuse the avatar logic from ProfileExplorer
// ... import any needed utilities here ...

// List of possible interests (should match your dataset)
const INTERESTS = ['cooking', 'hiking', 'movies', 'music', 'reading', 'sports', 'travel'];
const GOALS = ['Casual Dating', 'Friendship', 'Long-term Relationship', 'Marriage'];
const GENDERS = ['Male', 'Female'];

// Helper to reconstruct interests array from one-hot columns
function getUserInterests(user: any) {
  return INTERESTS.filter(interest => user[interest] === 1 || user[interest] === 1.0);
}
// Helper to map gender from 0/1 to string
function getUserGender(user: any) {
  return user.gender === 0 ? 'Male' : 'Female';
}

const ProfileGenerator: React.FC = () => {
  // State for the fictional profile
  const [age, setAge] = useState(27);
  const [gender, setGender] = useState('Female');
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState(GOALS[0]);
  const [showResult, setShowResult] = useState(false);
  const { data } = useDataset(); // Only use data
  const { setProfile } = useUserJourney(); // Access context setter

  // Result state
  const [fuzzyPercentile, setFuzzyPercentile] = useState<number | null>(null); // fuzzy match
  const [attributeMatches, setAttributeMatches] = useState<{label: string, percent: number}[]>([]); // attribute-by-attribute
  const [commonInterests, setCommonInterests] = useState<string[]>([]);

  // Handle form submit
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.length) return;
    setProfile({ age, gender, interests, goal });
    // --- Fuzzy matches: match on at least 3/4 attributes ---
    const fuzzyMatches = data.filter(u => {
      let score = 0;
      if (getUserGender(u) === gender) score++;
      if (u['looking_for'] === goal) score++;
      if (Math.abs(u.age - age) <= 2) score++;
      if (getUserInterests(u).some(i => interests.includes(i))) score++;
      return score >= 3;
    });
    setFuzzyPercentile(Math.round((fuzzyMatches.length / data.length) * 100));

    // --- Attribute-by-attribute matches ---
    const attrStats: {label: string, percent: number}[] = [];
    // Age (within 2 years)
    const ageMatch = data.filter(u => Math.abs(u.age - age) <= 2).length;
    attrStats.push({label: `Age ${age}±2`, percent: Math.round((ageMatch / data.length) * 100)});
    // Gender
    const genderMatch = data.filter(u => getUserGender(u) === gender).length;
    attrStats.push({label: gender, percent: Math.round((genderMatch / data.length) * 100)});
    // Goal
    const goalMatch = data.filter(u => u['looking_for'] === goal).length;
    attrStats.push({label: goal, percent: Math.round((goalMatch / data.length) * 100)});
    // Each selected interest
    interests.forEach(interest => {
      const interestMatch = data.filter(u => getUserInterests(u).includes(interest)).length;
      attrStats.push({label: interest, percent: Math.round((interestMatch / data.length) * 100)});
    });
    setAttributeMatches(attrStats);

    // --- Common interests among fuzzy matches ---
    const interestCounts: { [key: string]: number } = {};
    fuzzyMatches.forEach(u => {
      getUserInterests(u).forEach(i => {
        if (!interests.includes(i)) {
          interestCounts[i] = (interestCounts[i] || 0) + 1;
        }
      });
    });
    const sorted = Object.entries(interestCounts).sort((a, b) => b[1] - a[1]);
    setCommonInterests(sorted.slice(0, 3).map(([i]) => i));
    setShowResult(true);
  };

  // Handle interest selection
  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  // Avatar URL (reuse logic from ProfileExplorer)
  const getAvatarUrl = () => {
    const seed = `${gender}-${age}-${goal}`;
    const style = 'adventurer-neutral';
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-pink-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">Profile Generator</h1>
      <p className="mb-8 text-lg text-center text-gray-700 max-w-xl">
        Build a fictional dating profile and see how unique you are! Discover your percentile and what people like you also enjoy.
      </p>
      <form onSubmit={handleGenerate} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mb-8 animate-fade-in">
        {/* Age */}
        <label className="block mb-4">
          <span className="font-medium">Age:</span>
          <input type="number" min={18} max={35} value={age} onChange={e => setAge(Number(e.target.value))} className="ml-2 border rounded px-2 py-1 w-20" />
        </label>
        {/* Gender */}
        <label className="block mb-4">
          <span className="font-medium">Gender:</span>
          <select value={gender} onChange={e => setGender(e.target.value)} className="ml-2 border rounded px-2 py-1">
            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        {/* Interests */}
        <div className="mb-4">
          <span className="font-medium">Interests:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {INTERESTS.map(interest => (
              <button type="button" key={interest} onClick={() => toggleInterest(interest)}
                className={`px-3 py-1 rounded-full border transition-all ${interests.includes(interest) ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}>{interest}</button>
            ))}
          </div>
        </div>
        {/* Goal */}
        <label className="block mb-6">
          <span className="font-medium">Relationship Goal:</span>
          <select value={goal} onChange={e => setGoal(e.target.value)} className="ml-2 border rounded px-2 py-1">
            {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-purple-700 transition-colors animate-bounce">Analyze My Profile</button>
      </form>
      {/* Results Section */}
      {showResult && (
        <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8 text-center animate-fade-in">
          {/* Animated Avatar */}
          <img src={getAvatarUrl()} alt="Avatar" className="mx-auto mb-4 w-32 h-32 rounded-full border-4 border-purple-200 shadow-lg animate-pop" />
          {/* Fuzzy Percentile only */}
          <div className="mb-4">
            <span className="text-xl font-bold text-blue-600">{fuzzyPercentile}%</span>
            <span className="ml-2 text-base text-gray-700">similar (3/4 attributes)</span>
          </div>
          {/* Uniqueness celebration */}
          {fuzzyPercentile === 0 && (
            <div className="mb-4 text-pink-600 font-bold text-lg flex flex-col items-center">
              <span>🎉 You're a unicorn! No one is quite like you. 🦄</span>
            </div>
          )}
          {/* Attribute-by-attribute matches */}
          <div className="mb-4">
            <span className="font-medium text-gray-700">Attribute matches:</span>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {attributeMatches.map(attr => (
                <span key={attr.label} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold animate-bounce-in">
                  {attr.label}: {attr.percent}%
                </span>
              ))}
            </div>
          </div>
          {/* Common Interests */}
          <div className="mb-4">
            <span className="font-medium text-gray-700">People like you also like:</span>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {commonInterests.length > 0 ? commonInterests.map(i => (
                <span key={i} className="px-3 py-1 rounded-full bg-pink-200 text-pink-800 font-semibold animate-bounce-in">{i}</span>
              )) : <span className="text-gray-400">No extra interests found</span>}
            </div>
          </div>
          {/* Next Step Suggestion */}
          <div className="mb-6 mt-8 flex flex-col items-center">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-md flex flex-col items-center">
              <span className="text-lg font-semibold text-purple-700 mb-2">What's next?</span>
              <span className="text-gray-700 mb-3">See how your profile would perform in the Swipe Game!</span>
              <a href="/swipe-game" className="px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors">Go to Swipe Game</a>
            </div>
          </div>
          {/* Try Again Button */}
          <button onClick={() => setShowResult(false)} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors">Try Another Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfileGenerator; 