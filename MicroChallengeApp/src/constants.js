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

/** Ordered by ascending threshold; current title is the highest tier where totalPoints >= minPoints */
export const POINT_RANKS = [
  { title: "Beginner", minPoints: 0 },
  { title: "Explorer", minPoints: 100 },
  { title: "Challenger", minPoints: 250 },
  { title: "Consistency Builder", minPoints: 500 },
  { title: "Momentum Master", minPoints: 1000 },
  { title: "Habit Architect", minPoints: 1500 },
];

/** canvas-confetti presets — visible “nice reward” burst; rank = clearly stronger multi-burst + finale */
export const CONFETTI_COMPLETION = {
  particleCount: 110,
  spread: 72,
  startVelocity: 44,
  ticks: 112,
  gravity: 1.04,
  scalar: 0.98,
  origin: { y: 0.58 },
  colors: ["#0ca678", "#20c997", "#96f2d7", "#e6fcf5"],
};

export const CONFETTI_RANK_BURST = {
  primaryBursts: 5,
  burstDelayMs: 62,
  particleCount: 102,
  spread: 92,
  startVelocity: 58,
  ticks: 128,
  gravity: 0.98,
  scalar: 1.14,
  origin: { y: 0.62 },
  colors: ["#FFD700", "#FFC107", "#FFA000", "#0ca678", "#fff8e1"],
  finale: {
    particleCount: 78,
    spread: 118,
    startVelocity: 52,
    ticks: 118,
    gravity: 1,
    scalar: 1.12,
    origin: { y: 0.52 },
    colors: ["#FFD700", "#ffffff", "#FFA500", "#ffe066"],
  },
};

export const EXAMPLE_CHALLENGES = [
  { title: "Learn how to make homemade pizza dough", category: "Learning", difficulty: "Medium", timeCommitment: "Half day" },
  { title: "Take a 15-minute walk without your phone", category: "Mindfulness", difficulty: "Easy", timeCommitment: "Quick win" },
  { title: "Write down 3 priorities for today", category: "Productivity", difficulty: "Easy", timeCommitment: "Quick win" },
  { title: "Do a short stretching routine", category: "Health", difficulty: "Easy", timeCommitment: "Quick win" },
  { title: "Message one friend you miss", category: "Social", difficulty: "Easy", timeCommitment: "Quick win" },
  { title: "Sketch one idea for a personal project", category: "Creativity", difficulty: "Medium", timeCommitment: "30–60 min" },
];
