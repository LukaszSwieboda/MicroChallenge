import React, { useState, useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { CATEGORIES, DIFFICULTIES, TIME_COMMITMENTS, DEFAULT_CATEGORY, DEFAULT_DIFFICULTY, DEFAULT_TIME_COMMITMENT } from "../constants.js";
import { TextInput, Select, Button, Group, Paper, Alert } from "@mantine/core";

const AddChallenge = () => {
  const { addChallenge } = useContext(ChallengeContext);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [timeCommitment, setTimeCommitment] = useState(DEFAULT_TIME_COMMITMENT);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title can't be empty");
      return;
    }
    addChallenge({ title, category, difficulty, timeCommitment });
    setTitle("");
    setCategory(DEFAULT_CATEGORY);
    setDifficulty(DEFAULT_DIFFICULTY);
    setTimeCommitment(DEFAULT_TIME_COMMITMENT);
    setError("");
  };

  return (
    <Paper shadow="xs" p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <TextInput
          placeholder="Enter challenge title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={error || undefined}
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
            label="Difficulty"
            data={DIFFICULTIES}
            value={difficulty}
            onChange={(val) => setDifficulty(val || DEFAULT_DIFFICULTY)}
            allowDeselect={false}
          />
          <Select
            label="Time"
            data={TIME_COMMITMENTS}
            value={timeCommitment}
            onChange={(val) => setTimeCommitment(val || DEFAULT_TIME_COMMITMENT)}
            allowDeselect={false}
          />
        </Group>

        <Button type="submit" fullWidth>Add Challenge</Button>
      </form>
    </Paper>
  );
};

export default AddChallenge;
