import React, { createContext, useContext, useState } from 'react';

// Define the shape of the profile
export interface UserProfile {
  age: number;
  gender: string;
  interests: string[];
  goal: string;
}

// Context type
interface UserJourneyContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
}

const UserJourneyContext = createContext<UserJourneyContextType | undefined>(undefined);

export const UserJourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  return (
    <UserJourneyContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserJourneyContext.Provider>
  );
};

export const useUserJourney = () => {
  const context = useContext(UserJourneyContext);
  if (!context) throw new Error('useUserJourney must be used within a UserJourneyProvider');
  return context;
}; 