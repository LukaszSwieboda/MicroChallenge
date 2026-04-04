import { CATEGORIES, DIFFICULTIES, TIME_COMMITMENTS } from "../constants.js";

const API_KEY_STORAGE = "mc_openai_key";

const MOCK_TEMPLATES = {
  General: [
    "{time}: Try something new related to {goal}",
    "{time}: Explore {goal} from a different angle",
    "{time}: Focus entirely on {goal}",
    "{time}: Write down 3 ideas about {goal}",
    "{time}: Teach someone one thing about {goal}",
  ],
  Health: [
    "{time}: Do a health routine focused on {goal}",
    "{time}: Prepare a healthy snack inspired by {goal}",
    "{time}: Take a walk while thinking about {goal}",
    "{time}: Drink water and stretch with {goal} in mind",
    "{time}: Log your {goal} habits",
  ],
  Fitness: [
    "{time}: Complete a workout targeting {goal}",
    "{time}: Do a stretching session for {goal}",
    "{time}: Walk or jog while focusing on {goal}",
    "{time}: Try a new exercise that supports {goal}",
    "{time}: Do bodyweight exercises for {goal}",
  ],
  Learning: [
    "{time}: Read about {goal}",
    "{time}: Watch a tutorial about {goal}",
    "{time}: Write a summary of what you know about {goal}",
    "{time}: Find and bookmark 3 resources about {goal}",
    "{time}: Practice {goal} using a new method",
  ],
  Creativity: [
    "{time}: Sketch or doodle something about {goal}",
    "{time}: Brainstorm 5 creative ideas for {goal}",
    "{time}: Write a short story or poem about {goal}",
    "{time}: Create a mood board for {goal}",
    "{time}: Remix an existing idea about {goal}",
  ],
  Productivity: [
    "{time}: Organize your workspace for {goal}",
    "{time}: Plan your next steps for {goal}",
    "{time}: Clear your inbox or task list related to {goal}",
    "{time}: Set 3 small goals for {goal}",
    "{time}: Do a focus sprint on {goal}",
  ],
  Social: [
    "{time}: Reach out to someone about {goal}",
    "{time}: Have a conversation about {goal}",
    "{time}: Write a message to a friend about {goal}",
    "{time}: Share something you learned about {goal}",
    "{time}: Help someone with {goal}",
  ],
  Mindfulness: [
    "{time}: Meditate on {goal}",
    "{time}: Journal about {goal}",
    "{time}: Do a breathing exercise with {goal} as intention",
    "{time}: Take a mindful break focused on {goal}",
    "{time}: Reflect on your progress with {goal}",
  ],
};

const pickRandom = (arr, count) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const generateMock = ({ goal, category, timeCommitment, difficulty }) => {
  const templates = MOCK_TEMPLATES[category] || MOCK_TEMPLATES.General;
  const picked = pickRandom(templates, 3);

  return picked.map((template) => ({
    title: template
      .replace("{goal}", goal)
      .replace("{time}", timeCommitment),
    category,
    difficulty: difficulty || DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)],
    timeCommitment,
  }));
};

const buildPrompt = ({ goal, category, timeCommitment, difficulty }) => {
  const difficultyPart = difficulty ? ` at ${difficulty} difficulty` : "";
  return `Generate exactly 3 micro challenge suggestions.

Context:
- Goal: ${goal}
- Category: ${category}
- Time commitment: ${timeCommitment}${difficultyPart}

Return ONLY a JSON array with 3 objects, each with these fields:
- "title": short actionable challenge title (max 80 chars)
- "category": "${category}"
- "difficulty": one of ${JSON.stringify(DIFFICULTIES)}
- "timeCommitment": one of ${JSON.stringify(TIME_COMMITMENTS)}

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

  const fallbackDifficulty = params.difficulty || "Easy";
  const forcedTime = params.timeCommitment || TIME_COMMITMENTS[0];

  return parsed.slice(0, 3).map((item) => ({
    title: String(item.title || "Untitled").slice(0, 120),
    category: CATEGORIES.includes(item.category) ? item.category : params.category,
    difficulty: normalizeDifficulty(item.difficulty, fallbackDifficulty),
    timeCommitment: forcedTime,
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
