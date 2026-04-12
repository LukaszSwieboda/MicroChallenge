export const CATEGORIES = [
  "General",
  "Health",
  "Fitness",
  "Learning",
  "Creativity",
  "Productivity",
  "Social",
  "Mindfulness",
];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const TIME_COMMITMENTS = ["Quick win", "30–60 min", "Half day", "Full day"];

export const CHALLENGE_STATUSES = ["planned", "in_progress", "completed"];
export const DEFAULT_CHALLENGE_STATUS = CHALLENGE_STATUSES[0];

export const DIFFICULTY_POINTS = { Easy: 10, Medium: 25, Hard: 50 };
export const TIME_COMMITMENT_MULTIPLIERS = { "Quick win": 1, "30–60 min": 1.5, "Half day": 2, "Full day": 3 };

export const DEFAULT_CATEGORY = CATEGORIES[0];
export const DEFAULT_DIFFICULTY = DIFFICULTIES[0];
export const DEFAULT_TIME_COMMITMENT = TIME_COMMITMENTS[0];

export const EXAMPLE_CHALLENGES = [
  { title: "Learn how to make homemade pizza dough", category: "Learning", difficulty: "Medium", timeCommitment: "Half day" },
  { title: "Take a 15-minute walk without your phone", category: "Mindfulness", difficulty: "Easy", timeCommitment: "Quick win" },
  { title: "Write down 3 priorities for today", category: "Productivity", difficulty: "Easy", timeCommitment: "Quick win" },
  { title: "Do a short stretching routine", category: "Health", difficulty: "Easy", timeCommitment: "Quick win" },
  { title: "Message one friend you miss", category: "Social", difficulty: "Easy", timeCommitment: "Quick win" },
  { title: "Sketch one idea for a personal project", category: "Creativity", difficulty: "Medium", timeCommitment: "30–60 min" },
];
