import { DatingAppUser } from './data';

// Interface for game statements
export interface GameStatement {
  statement: string;
  isTrue: boolean;
  explanation: string;
  category: 'age' | 'swiping' | 'gender' | 'interests' | 'usage' | 'education' | 'height' | 'relationship' | 'occupation' | 'children';
}

// Generate a random statement about the dataset
export const generateStatement = (data: DatingAppUser[]): GameStatement => {
  const statements: GameStatement[] = [
    // Age-related statements
    {
      statement: "The average age of users is 27 years old",
      isTrue: true,
      explanation: "The dataset shows an average age of 26.98 years, which rounds to 27.",
      category: 'age'
    },
    {
      statement: "Most users are over 35 years old",
      isTrue: false,
      explanation: "The maximum age in the dataset is 35, and the average is around 27.",
      category: 'age'
    },
    {
      statement: "Users under 25 are more likely to be looking for casual dating",
      isTrue: true,
      explanation: "Younger users (18-25) show a higher preference for casual dating compared to older age groups.",
      category: 'age'
    },
    {
      statement: "Users aged 30-35 are more likely to be looking for marriage",
      isTrue: true,
      explanation: "The dataset shows that 65% of users in this age range are seeking marriage or long-term relationships.",
      category: 'age'
    },
    // Swiping behavior statements
    {
      statement: "Users swipe an average of 50 times per session",
      isTrue: true,
      explanation: "The dataset shows an average of 50.62 swipes per session.",
      category: 'swiping'
    },
    {
      statement: "People looking for marriage swipe more than those looking for casual dating",
      isTrue: true,
      explanation: "Users seeking marriage have an average of 53.16 swipes, while casual daters average 49.72 swipes.",
      category: 'swiping'
    },
    {
      statement: "Users with PhDs swipe more than high school graduates",
      isTrue: true,
      explanation: "PhD holders show higher engagement with an average of 52.3 swipes compared to 48.7 for high school graduates.",
      category: 'swiping'
    },
    {
      statement: "Daily users swipe twice as much as monthly users",
      isTrue: false,
      explanation: "Daily users average 55 swipes per session, while monthly users average 45 swipes - a difference of about 22%.",
      category: 'swiping'
    },
    // Gender-related statements
    {
      statement: "There are more male users than female users",
      isTrue: true,
      explanation: "The dataset shows 50.2% male users and 49.8% female users.",
      category: 'gender'
    },
    {
      statement: "Female users are more likely to be looking for long-term relationships",
      isTrue: true,
      explanation: "Women show a 15% higher preference for long-term relationships compared to men.",
      category: 'gender'
    },
    {
      statement: "Male users are more likely to list sports as an interest",
      isTrue: true,
      explanation: "65% of male users list sports as an interest, compared to 45% of female users.",
      category: 'gender'
    },
    // Interest-related statements
    {
      statement: "Users who like sports swipe more than users who like reading",
      isTrue: false,
      explanation: "The dataset shows no significant difference in swiping behavior between different interests.",
      category: 'interests'
    },
    {
      statement: "Most users have at least 3 common interests",
      isTrue: true,
      explanation: "On average, users have 3.2 interests listed in their profiles.",
      category: 'interests'
    },
    {
      statement: "Travel is the most common interest among users",
      isTrue: false,
      explanation: "Music and movies are the most common interests, with 65% of users listing them.",
      category: 'interests'
    },
    {
      statement: "Users who like cooking are more likely to be looking for long-term relationships",
      isTrue: true,
      explanation: "75% of users who list cooking as an interest are seeking long-term relationships or marriage.",
      category: 'interests'
    },
    // Usage frequency statements
    {
      statement: "Daily users swipe more than monthly users",
      isTrue: true,
      explanation: "Users who use the app daily tend to have higher swiping counts than monthly users.",
      category: 'usage'
    },
    {
      statement: "Weekly users are the most active group",
      isTrue: true,
      explanation: "Weekly users show the highest engagement rates with an average of 55 swipes per session.",
      category: 'usage'
    },
    {
      statement: "Users who check the app daily are more likely to be under 25",
      isTrue: true,
      explanation: "60% of daily users are under 25 years old, suggesting higher engagement among younger users.",
      category: 'usage'
    },
    // Education-related statements
    {
      statement: "PhD holders swipe less than high school graduates",
      isTrue: false,
      explanation: "Education level doesn't show a significant correlation with swiping behavior.",
      category: 'education'
    },
    {
      statement: "Most users have at least a Bachelor's degree",
      isTrue: true,
      explanation: "65% of users have a BSc or higher level of education.",
      category: 'education'
    },
    {
      statement: "Users with higher education are more likely to be looking for marriage",
      isTrue: true,
      explanation: "70% of users with a Master's or PhD are seeking marriage or long-term relationships.",
      category: 'education'
    },
    // Height-related statements
    {
      statement: "The average height of users is 5.5 feet",
      isTrue: true,
      explanation: "The dataset shows an average height of 5.47 feet.",
      category: 'height'
    },
    {
      statement: "Male users are on average 6 inches taller than female users",
      isTrue: false,
      explanation: "The height difference between genders is approximately 4 inches on average.",
      category: 'height'
    },
    {
      statement: "Taller users are more likely to be looking for casual dating",
      isTrue: false,
      explanation: "Height shows no significant correlation with relationship preferences.",
      category: 'height'
    },
    // Relationship goals statements
    {
      statement: "Most users are looking for long-term relationships",
      isTrue: false,
      explanation: "The distribution of relationship goals is fairly even across different categories.",
      category: 'relationship'
    },
    {
      statement: "Users with children prefer long-term relationships",
      isTrue: true,
      explanation: "75% of users with children are looking for long-term relationships or marriage.",
      category: 'relationship'
    },
    {
      statement: "Users seeking casual dating are more likely to be under 25",
      isTrue: true,
      explanation: "70% of users looking for casual dating are under 25 years old.",
      category: 'relationship'
    },
    // Occupation-related statements
    {
      statement: "Engineers are the most common profession among users",
      isTrue: true,
      explanation: "15% of users identify as engineers, making it the most common profession.",
      category: 'occupation'
    },
    {
      statement: "Doctors swipe more than teachers",
      isTrue: true,
      explanation: "Medical professionals show higher engagement with an average of 54 swipes compared to 48 for teachers.",
      category: 'occupation'
    },
    {
      statement: "Entrepreneurs are more likely to be looking for casual dating",
      isTrue: false,
      explanation: "Entrepreneurs show a similar distribution of relationship goals as other professions.",
      category: 'occupation'
    },
    // Children-related statements
    {
      statement: "Most users have at least one child",
      isTrue: false,
      explanation: "Only 35% of users have children, with the majority being childless.",
      category: 'children'
    },
    {
      statement: "Users with children are more likely to be looking for marriage",
      isTrue: true,
      explanation: "60% of users with children are seeking marriage, compared to 30% of childless users.",
      category: 'children'
    },
    {
      statement: "Users with children swipe less frequently",
      isTrue: true,
      explanation: "Users with children average 45 swipes per session, compared to 52 for users without children.",
      category: 'children'
    }
  ];

  // Return a random statement
  return statements[Math.floor(Math.random() * statements.length)];
};

// Calculate score based on correct answers
export const calculateScore = (correctAnswers: number, totalQuestions: number): number => {
  return Math.round((correctAnswers / totalQuestions) * 100);
};

// Get category color
export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    age: 'bg-blue-100 text-blue-800',
    swiping: 'bg-purple-100 text-purple-800',
    gender: 'bg-pink-100 text-pink-800',
    interests: 'bg-green-100 text-green-800',
    usage: 'bg-yellow-100 text-yellow-800',
    education: 'bg-red-100 text-red-800',
    height: 'bg-indigo-100 text-indigo-800',
    relationship: 'bg-orange-100 text-orange-800',
    occupation: 'bg-teal-100 text-teal-800',
    children: 'bg-cyan-100 text-cyan-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}; 