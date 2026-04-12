import React, { useState, useContext, useRef } from "react";
import { ChallengeContext, calculatePoints } from "../components/ChallengeContext.jsx";
import { CATEGORIES, DIFFICULTIES, TIME_COMMITMENTS, DEFAULT_CATEGORY, DEFAULT_TIME_COMMITMENT } from "../constants.js";
import {
  generateChallengeSuggestions,
  isUsingRealAPI,
  getApiKey,
  setApiKey,
} from "../services/aiService.js";
import { Stack, Title, Paper, TextInput, PasswordInput, Select, Button, Group, Text, Badge, Alert } from "@mantine/core";

const AIGenerator = () => {
  const { addChallenge } = useContext(ChallengeContext);

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

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError("Please describe your goal.");
      return;
    }

    setLoading(true);
    setError("");
    setSuggestions([]);
    setSavedIndexes(new Set());
    savingRef.current = new Set();

    try {
      const results = await generateChallengeSuggestions({
        goal: goal.trim(),
        category,
        timeCommitment,
        difficulty: difficulty || undefined,
      });
      setSuggestions(results);
    } catch (err) {
      setError(err.message || "Failed to generate suggestions.");
    } finally {
      setLoading(false);
    }
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

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>AI Challenge Generator</Title>
        <Group gap="xs">
          <Badge variant="light" color={isUsingRealAPI() ? "green" : "gray"}>
            {isUsingRealAPI() ? "OpenAI API" : "Demo Mode"}
          </Badge>
          <Button
            size="xs"
            variant="default"
            onClick={() => setShowKeyInput(!showKeyInput)}
          >
            {showKeyInput ? "Hide" : "API Key"}
          </Button>
        </Group>
      </Group>

      {showKeyInput && (
        <Paper shadow="xs" p="sm" withBorder>
          <Group>
            <PasswordInput
              placeholder="sk-..."
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.currentTarget.value)}
              style={{ flex: 1 }}
              size="sm"
            />
            <Button size="sm" onClick={handleSaveKey}>
              {apiKeyDraft.trim() ? "Save Key" : "Clear Key"}
            </Button>
          </Group>
        </Paper>
      )}

      <Paper shadow="xs" p="md" withBorder>
        <form onSubmit={handleGenerate}>
          <TextInput
            placeholder="What's your goal? (e.g. improve focus, learn guitar)"
            value={goal}
            onChange={(e) => setGoal(e.currentTarget.value)}
            mb="sm"
          />

          <Group grow mb="sm">
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

          <Button type="submit" loading={loading} fullWidth>
            Generate Suggestions
          </Button>
        </form>
      </Paper>

      {error && <Alert color="red" variant="light">{error}</Alert>}

      {suggestions.length > 0 && (
        <Stack gap="xs">
          <Title order={4}>Suggestions</Title>
          {suggestions.map((s, i) => (
            <Paper key={i} shadow="xs" p="sm" withBorder>
              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={600} size="sm">{s.title}</Text>
                  <Group gap={6} mt={2}>
                    <Badge size="xs" variant="light">{s.category}</Badge>
                    <Badge size="xs" variant="light" color="orange">{s.difficulty}</Badge>
                    <Badge size="xs" variant="light" color="gray">{s.timeCommitment}</Badge>
                    <Badge size="xs" variant="filled" color="teal">{calculatePoints(s.difficulty, s.timeCommitment)} pts</Badge>
                  </Group>
                </div>
                <Button
                  size="xs"
                  variant={savedIndexes.has(i) ? "default" : "light"}
                  color={savedIndexes.has(i) ? "gray" : "green"}
                  onClick={() => handleSave(s, i)}
                  disabled={savedIndexes.has(i)}
                >
                  {savedIndexes.has(i) ? "Saved" : "Save"}
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <Text c="dimmed" fs="italic" ta="center">
          Describe your goal and generate AI-powered challenge ideas.
        </Text>
      )}
    </Stack>
  );
};

export default AIGenerator;
