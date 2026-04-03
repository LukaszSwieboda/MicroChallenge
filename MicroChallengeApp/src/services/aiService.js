import { CATEGORIES, DIFFICULTIES } from "../constants.js";

const API_KEY_STORAGE = "mc_openai_key";

const MOCK_TEMPLATES = {
  General: [
    "Try something new for {minutes} minutes related to {goal}",
    "Spend {minutes} minutes exploring {goal} from a different angle",
    "Set a {minutes}-minute timer and focus entirely on {goal}",
    "Write down 3 ideas about {goal} in under {minutes} minutes",
    "Teach someone one thing about {goal} in {minutes} minutes",
  ],
  Health: [
    "Do a {minutes}-minute health routine focused on {goal}",
    "Prepare a healthy snack inspired by {goal} in {minutes} minutes",
    "Take a {minutes}-minute walk while thinking about {goal}",
    "Drink water and stretch for {minutes} minutes with {goal} in mind",
    "Log your {goal} habits for the next {minutes} minutes",
  ],
  Fitness: [
    "Complete a {minutes}-minute workout targeting {goal}",
    "Do a {minutes}-minute stretching session for {goal}",
    "Walk or jog for {minutes} minutes while focusing on {goal}",
    "Try a new {minutes}-minute exercise that supports {goal}",
    "Do {minutes} minutes of bodyweight exercises for {goal}",
  ],
  Learning: [
    "Read about {goal} for {minutes} minutes",
    "Watch a tutorial about {goal} — max {minutes} minutes",
    "Write a summary of what you know about {goal} in {minutes} minutes",
    "Find and bookmark 3 resources about {goal} in {minutes} minutes",
    "Practice {goal} for {minutes} minutes using a new method",
  ],
  Creativity: [
    "Sketch or doodle something about {goal} for {minutes} minutes",
    "Brainstorm 5 creative ideas for {goal} in {minutes} minutes",
    "Write a short story or poem about {goal} in {minutes} minutes",
    "Create a mood board for {goal} in under {minutes} minutes",
    "Remix an existing idea about {goal} in {minutes} minutes",
  ],
  Productivity: [
    "Organize your workspace for {goal} in {minutes} minutes",
    "Plan your next steps for {goal} in a {minutes}-minute session",
    "Clear your inbox or task list related to {goal} in {minutes} minutes",
    "Set 3 small goals for {goal} in under {minutes} minutes",
    "Do a {minutes}-minute focus sprint on {goal}",
  ],
  Social: [
    "Reach out to someone about {goal} — spend {minutes} minutes",
    "Have a {minutes}-minute conversation about {goal}",
    "Write a message to a friend about {goal} in {minutes} minutes",
    "Share something you learned about {goal} in {minutes} minutes",
    "Help someone with {goal} for {minutes} minutes",
  ],
  Mindfulness: [
    "Meditate on {goal} for {minutes} minutes",
    "Journal about {goal} for {minutes} minutes",
    "Do a {minutes}-minute breathing exercise with {goal} as intention",
    "Take a {minutes}-minute mindful break focused on {goal}",
    "Reflect on your progress with {goal} for {minutes} minutes",
  ],
};

const pickRandom = (arr, count) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const generateMock = ({ goal, category, availableMinutes, difficulty }) => {
  const templates = MOCK_TEMPLATES[category] || MOCK_TEMPLATES.General;
  const picked = pickRandom(templates, 3);

  return picked.map((template) => ({
    title: template
      .replace("{goal}", goal)
      .replace(/{minutes}/g, String(availableMinutes)),
    category,
    difficulty: difficulty || DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)],
    estimatedMinutes: availableMinutes,
  }));
};

const buildPrompt = ({ goal, category, availableMinutes, difficulty }) => {
  const difficultyPart = difficulty ? ` at ${difficulty} difficulty` : "";
  return `Generate exactly 3 micro challenge suggestions.

Context:
- Goal: ${goal}
- Category: ${category}
- Available time: ${availableMinutes} minutes${difficultyPart}

Return ONLY a JSON array with 3 objects, each with these fields:
- "title": short actionable challenge title (max 80 chars)
- "category": "${category}"
- "difficulty": one of ${JSON.stringify(DIFFICULTIES)}
- "estimatedMinutes": number between 1 and ${availableMinutes}

No markdown, no explanation, just the JSON array.`;
};

const normalizeDifficulty = (val, fallback) => {
  if (!val) return fallback;
  const trimmed = String(val).trim();
  const match = DIFFICULTIES.find((d) => d.toLowerCase() === trimmed.toLowerCase());
  return match || fallback;
};

const parseAIResponse = (text, params) => {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array found in response");

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid response format");
  }

  const maxMinutes = params.availableMinutes || 120;
  const fallbackDifficulty = params.difficulty || "Easy";

  return parsed.slice(0, 3).map((item) => ({
    title: String(item.title || "Untitled").slice(0, 120),
    category: CATEGORIES.includes(item.category) ? item.category : params.category,
    difficulty: normalizeDifficulty(item.difficulty, fallbackDifficulty),
    estimatedMinutes: Number.isFinite(item.estimatedMinutes)
      ? Math.min(maxMinutes, Math.max(1, item.estimatedMinutes))
      : maxMinutes,
  }));
};

export const getApiKey = () => {
  try {
    return sessionStorage.getItem(API_KEY_STORAGE) || "";
  } catch {
    return "";
  }
};

export const setApiKey = (key) => {
  try {
    if (key) {
      sessionStorage.setItem(API_KEY_STORAGE, key);
    } else {
      sessionStorage.removeItem(API_KEY_STORAGE);
    }
  } catch {
    /* ignore */
  }
};

export const isUsingRealAPI = () => getApiKey().length > 0;

export const generateChallengeSuggestions = async (params) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
    return generateMock(params);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a micro challenge generator. You return only valid JSON." },
        { role: "user", content: buildPrompt(params) },
      ],
      temperature: 0.8,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from API");

  return parseAIResponse(content, params);
};
