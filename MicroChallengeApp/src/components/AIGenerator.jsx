import React, { useState, useContext, useRef, useMemo, useCallback } from "react";
import {
  ChallengeContext,
  calculatePoints,
  getTotalPoints,
  getCurrentTitle,
  getNextTitle,
  getPointsToNextTitle,
  getMilestoneProgress,
} from "../components/ChallengeContext.jsx";
import {
  CATEGORIES,
  DIFFICULTIES,
  TIME_COMMITMENTS,
  DEFAULT_CATEGORY,
  DEFAULT_TIME_COMMITMENT,
  DEFAULT_DIFFICULTY,
} from "../constants.js";
import {
  generateChallengeSuggestions,
  isUsingRealAPI,
  getApiKey,
  setApiKey,
} from "../services/aiService.js";
import {
  Stack,
  Title,
  Paper,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Group,
  Text,
  Badge,
  Alert,
  Progress,
  Divider,
} from "@mantine/core";

function pickDifficultyTimeForGap(gap) {
  if (gap <= 0) {
    return { difficulty: DEFAULT_DIFFICULTY, timeCommitment: DEFAULT_TIME_COMMITMENT };
  }
  let best = null;
  for (const tc of TIME_COMMITMENTS) {
    for (const diff of DIFFICULTIES) {
      const p = calculatePoints(diff, tc);
      if (p >= gap && (!best || p < best.points)) {
        best = { difficulty: diff, timeCommitment: tc, points: p };
      }
    }
  }
  if (best) return { difficulty: best.difficulty, timeCommitment: best.timeCommitment };
  return { difficulty: "Hard", timeCommitment: "Full day" };
}

const AIGenerator = () => {
  const { addChallenge, completedChallenges } = useContext(ChallengeContext);

  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [timeCommitment, setTimeCommitment] = useState(DEFAULT_TIME_COMMITMENT);
  const [difficulty, setDifficulty] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedIndexes, setSavedIndexes] = useState(new Set());
  const savingRef = useRef(new Set());

  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState(getApiKey());

  const totalPoints = useMemo(() => getTotalPoints(completedChallenges), [completedChallenges]);
  const currentRankTitle = getCurrentTitle(totalPoints);
  const nextRank = getNextTitle(totalPoints);
  const pointsRemaining = getPointsToNextTitle(totalPoints);
  const milestoneProgress = getMilestoneProgress(totalPoints);

  const handleGoalChange = (e) => {
    const v = e.currentTarget.value;
    setGoal(v);
    if (v.trim()) setError("");
  };

  const runGenerate = useCallback(
    async (overrides = {}) => {
      const goalText = (overrides.goal ?? goal).trim();
      if (!goalText) {
        setError("Please describe your goal.");
        return;
      }

      setLoading(true);
      setError("");
      setSuggestions([]);
      setSavedIndexes(new Set());
      savingRef.current = new Set();

      const cat = overrides.category ?? category;
      const tc = overrides.timeCommitment ?? timeCommitment;
      const diffRaw = overrides.difficulty !== undefined ? overrides.difficulty : difficulty;

      try {
        const results = await generateChallengeSuggestions({
          goal: goalText,
          category: cat,
          timeCommitment: tc,
          difficulty: diffRaw || undefined,
        });
        setSuggestions(results);
      } catch (err) {
        setError(err.message || "Failed to generate suggestions.");
      } finally {
        setLoading(false);
      }
    },
    [goal, category, timeCommitment, difficulty]
  );

  const handleGenerate = (e) => {
    e.preventDefault();
    runGenerate();
  };

  const handleGenerateForNextRank = async () => {
    if (!nextRank) return;
    const gap = pointsRemaining || nextRank.minPoints - totalPoints;
    const preset = pickDifficultyTimeForGap(gap);
    const suggestedGoal = `One concrete step toward ${nextRank.title}`;
    setGoal(suggestedGoal);
    setTimeCommitment(preset.timeCommitment);
    setDifficulty(preset.difficulty);
    await runGenerate({
      goal: suggestedGoal,
      timeCommitment: preset.timeCommitment,
      difficulty: preset.difficulty,
    });
  };

  const handleSave = (suggestion, index) => {
    if (savingRef.current.has(index)) return;
    savingRef.current.add(index);
    addChallenge(suggestion);
    setSavedIndexes((prev) => new Set(prev).add(index));
  };

  const handleSaveKey = () => {
    setApiKey(apiKeyDraft.trim());
    setShowKeyInput(false);
  };

  const apiConnected = isUsingRealAPI();

  return (
    <Stack gap="xl">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Stack gap={6} maw={560}>
            <Title order={1} size="h2" fw={700}>
              AI Challenge Generator
            </Title>
            <Text size="sm" c="dimmed">
              Turn a goal into three concrete micro-challenges you can save to your list.
            </Text>
          </Stack>
          <Paper px="md" py="sm" radius="md" withBorder bg="gray.0" style={{ flexShrink: 0 }}>
            <Group gap="sm" wrap="wrap" justify="flex-end">
              <Badge size="md" variant="light" color={apiConnected ? "green" : "gray"}>
                {apiConnected ? "API connected" : "Demo mode"}
              </Badge>
              <Button size="xs" variant="default" onClick={() => setShowKeyInput(!showKeyInput)}>
                {showKeyInput ? "Hide key" : "API key"}
              </Button>
            </Group>
          </Paper>
        </Group>
      </Stack>

      {showKeyInput && (
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group wrap="wrap" align="flex-end" gap="sm">
            <PasswordInput
              label="OpenAI API key"
              placeholder="sk-..."
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.currentTarget.value)}
              style={{ flex: "1 1 240px" }}
              size="sm"
            />
            <Button size="sm" onClick={handleSaveKey} w={{ base: "100%", sm: "auto" }}>
              {apiKeyDraft.trim() ? "Save key" : "Clear key"}
            </Button>
          </Group>
        </Paper>
      )}

      <Paper
        shadow="sm"
        p={{ base: "md", sm: "lg" }}
        radius="lg"
        withBorder
        styles={{
          root: {
            background: "linear-gradient(180deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-white) 100%)",
            borderColor: "var(--mantine-color-teal-2)",
          },
        }}
      >
        <Stack gap="md">
          <div>
            <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.6}>
              Rank progress
            </Text>
            <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm" mt={4}>
              <div>
                <Text fw={800} size="xl" c="teal.9">
                  {currentRankTitle}
                </Text>
                {nextRank ? (
                  <Text size="sm" c="dimmed" mt={4}>
                    Next: <Text span fw={600}>{nextRank.title}</Text> · {pointsRemaining} pts left
                  </Text>
                ) : (
                  <Text size="sm" c="dimmed" mt={4}>
                    Top rank — keep earning points.
                  </Text>
                )}
              </div>
              <Badge variant="filled" color="teal" size="lg" radius="sm" tt="none">
                {totalPoints} pts
              </Badge>
            </Group>
          </div>
          {nextRank != null && (
            <Progress
              value={milestoneProgress * 100}
              color="teal"
              size="sm"
              radius="xl"
              aria-label="Progress to next rank"
            />
          )}
          <Button
            type="button"
            variant="light"
            color="teal"
            loading={loading}
            disabled={!nextRank}
            onClick={handleGenerateForNextRank}
            w={{ base: "100%", sm: "auto" }}
            style={{ alignSelf: "flex-start" }}
          >
            Generate for next rank
          </Button>
        </Stack>
      </Paper>

      <Paper shadow="sm" p={{ base: "md", sm: "lg" }} radius="md" withBorder>
        <form onSubmit={handleGenerate}>
          <Stack gap="md">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.6}>
                New ideas
              </Text>
              <Text fw={600} size="md" mt={4}>
                Describe your goal
              </Text>
            </div>

            <TextInput
              label="Goal"
              placeholder="e.g. get better sleep, practice Spanish, clear my inbox"
              description="Tip: name one outcome, constraint, or habit — specific goals get tighter suggestions."
              value={goal}
              onChange={handleGoalChange}
            />

            <Group grow>
              <Select
                label="Category"
                data={CATEGORIES}
                value={category}
                onChange={(val) => setCategory(val || DEFAULT_CATEGORY)}
                allowDeselect={false}
              />
              <Select
                label="Time"
                data={TIME_COMMITMENTS}
                value={timeCommitment}
                onChange={(val) => setTimeCommitment(val || DEFAULT_TIME_COMMITMENT)}
                allowDeselect={false}
              />
              <Select
                label="Difficulty"
                data={[{ value: "", label: "Any" }, ...DIFFICULTIES.map((d) => ({ value: d, label: d }))]}
                value={difficulty}
                onChange={(val) => setDifficulty(val || "")}
                allowDeselect={false}
              />
            </Group>

            <Group justify={{ base: "stretch", sm: "flex-start" }} gap="sm" mt="xs">
              <Button type="submit" loading={loading} miw={200} w={{ base: "100%", sm: "auto" }}>
                Generate suggestions
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      {error && (
        <Alert color="red" variant="light" title="Could not generate" radius="md">
          {error}
        </Alert>
      )}

      {suggestions.length > 0 && (
        <Stack gap="md">
          <Divider label="Suggestions" labelPosition="left" />
          {suggestions.map((s, i) => (
            <Paper key={i} shadow="sm" p="md" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
                  <Text fw={600} size="sm" lineClamp={3} style={{ flex: 1, minWidth: 0 }}>
                    {s.title}
                  </Text>
                  <Badge size="lg" variant="filled" color="teal" style={{ flexShrink: 0 }}>
                    {calculatePoints(s.difficulty, s.timeCommitment)} pts
                  </Badge>
                </Group>
                <Group gap={6} wrap="wrap">
                  <Badge size="xs" variant="light">
                    {s.category}
                  </Badge>
                  <Badge size="xs" variant="light" color="orange">
                    {s.difficulty}
                  </Badge>
                  <Badge size="xs" variant="light" color="gray">
                    {s.timeCommitment}
                  </Badge>
                </Group>
                <Group justify="flex-start">
                  <Button
                    size="xs"
                    variant={savedIndexes.has(i) ? "default" : "filled"}
                    color={savedIndexes.has(i) ? "gray" : "teal"}
                    onClick={() => handleSave(s, i)}
                    disabled={savedIndexes.has(i)}
                    w={{ base: "100%", sm: "auto" }}
                  >
                    {savedIndexes.has(i) ? "Saved" : "Save to list"}
                  </Button>
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <Paper p="lg" radius="md" withBorder bg="gray.0">
          <Stack gap="xs" align="center" ta="center" maw={440} mx="auto">
            <Text fw={600}>Ready when you are</Text>
            <Text size="sm" c="dimmed">
              Add a goal above and generate three tailored ideas. In demo mode, suggestions use built-in templates;
              with an API key, OpenAI powers the copy.
            </Text>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default AIGenerator;
