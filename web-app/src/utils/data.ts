import { useEffect, useState } from 'react';
import * as d3 from 'd3';

export interface DatingAppUser {
  age: number;
  gender: string;
  height: number;
  relationship_goal: string;
  education_level: string;
  occupation: string;
  swipes_per_session: number;
  usage_frequency: string;
  interests: string[];
}

export const useDataset = () => {
  const [data, setData] = useState<DatingAppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/dataset_preprocessed.csv');
        const csvText = await response.text();
        
        // Parse CSV using d3
        const parsedData = d3.csvParse(csvText, (d): DatingAppUser => ({
          age: +d.Age!,
          gender: d.Gender === "0" ? "Male" : "Female",
          height: +d.Height!,
          relationship_goal: d["Looking For"]!,
          education_level: d["Education Level"]!,
          occupation: d.Occupation!,
          swipes_per_session: +d["Swiping History"]!,
          usage_frequency: d["Frequency of Usage"]!,
          interests: Object.entries(d)
            .filter(([key, value]) => ["cooking", "hiking", "movies", "music", "reading", "sports", "travel"].includes(key) && value === "1.0")
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
        }));

        setData(parsedData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};

// Utility functions for data processing
export const getAgeDistribution = (data: DatingAppUser[]) => {
  const ageGroups = ["18-22", "23-27", "28-32", "33-37", "38+"];
  const distribution = ageGroups.map(group => {
    const [min, max] = group.split("-").map(Number);
    return {
      age: group,
      male: data.filter(u => u.gender === "Male" && 
        (max ? (u.age >= min && u.age <= max) : u.age >= min)).length,
      female: data.filter(u => u.gender === "Female" && 
        (max ? (u.age >= min && u.age <= max) : u.age >= min)).length
    };
  });
  return distribution;
};

export const getRelationshipGoals = (data: DatingAppUser[]) => {
  const goals = Array.from(new Set(data.map(u => u.relationship_goal)));
  return goals.map(goal => ({
    goal,
    count: data.filter(u => u.relationship_goal === goal).length,
    byGender: {
      male: data.filter(u => u.relationship_goal === goal && u.gender === "Male").length,
      female: data.filter(u => u.relationship_goal === goal && u.gender === "Female").length
    }
  }));
};

export const getInterestDistribution = (data: DatingAppUser[]) => {
  const allInterests = new Set<string>();
  data.forEach(user => user.interests.forEach(interest => allInterests.add(interest)));
  
  return Array.from(allInterests).map(interest => ({
    interest,
    count: data.filter(u => u.interests.includes(interest)).length,
    byGender: {
      male: data.filter(u => u.gender === "Male" && u.interests.includes(interest)).length,
      female: data.filter(u => u.gender === "Female" && u.interests.includes(interest)).length
    }
  })).sort((a, b) => b.count - a.count);
};

export const getUsagePatterns = (data: DatingAppUser[]) => {
  const frequencies = Array.from(new Set(data.map(u => u.usage_frequency)));
  return frequencies.map(freq => ({
    frequency: freq,
    count: data.filter(u => u.usage_frequency === freq).length,
    avgSwipes: d3.mean(data.filter(u => u.usage_frequency === freq), d => d.swipes_per_session) || 0,
    byGender: {
      male: data.filter(u => u.usage_frequency === freq && u.gender === "Male").length,
      female: data.filter(u => u.usage_frequency === freq && u.gender === "Female").length
    }
  }));
}; 