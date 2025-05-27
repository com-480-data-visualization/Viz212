import { useEffect, useState } from 'react';

// Types
export interface DatingAppUser {
  user_id: number;
  age: number;
  gender: string;
  height: number;
  looking_for: string;
  children: string;
  education_level: string;
  occupation: string;
  swiping_history: number;
  usage_frequency: string;
  // Add interests if you include them in users.json
  interests?: string[];
}

// USERS DATA HOOK
export const useDataset = () => {
  const [data, setData] = useState<DatingAppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/users.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

// AGGREGATES DATA HOOK
export const useAggregates = () => {
  const [aggregates, setAggregates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/aggregates.json')
      .then(res => res.json())
      .then(setAggregates)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { aggregates, loading, error };
};

// GAME STATEMENTS HOOK
export const useGameStatements = () => {
  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/game_statements.json')
      .then(res => res.json())
      .then(setStatements)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { statements, loading, error };
};

// INTEREST NETWORK HOOK
export const useInterestNetwork = () => {
  const [network, setNetwork] = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/interest_network.json')
      .then(res => res.json())
      .then(setNetwork)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { network, loading, error };
};


// OPTIONAL: Helper to convert aggregates.relationship_goals to array for charting
export const relationshipGoalsArray = (aggregates: any) =>
  aggregates && aggregates.relationship_goals
    ? Object.entries(aggregates.relationship_goals).map(([goal, count]) => ({ goal, count }))
    : [];

// OPTIONAL: Helper to convert aggregates.age_distribution to array for charting
export const ageDistributionArray = (aggregates: any) =>
  aggregates && aggregates.age_distribution
    ? Object.entries(aggregates.age_distribution).map(([age, count]) => ({ age, count }))
    : [];

// Add similar helpers for other precomputed aggregates as needed 

const GENDERS = ['male', 'female'];
