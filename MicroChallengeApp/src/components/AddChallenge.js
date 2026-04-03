import React, { useState, useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.js";
import { CATEGORIES, DIFFICULTIES, DEFAULT_CATEGORY, DEFAULT_DIFFICULTY, DEFAULT_MINUTES } from "../constants.js";

const AddChallenge = () => {
  const { addChallenge } = useContext(ChallengeContext);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [estimatedMinutes, setEstimatedMinutes] = useState(DEFAULT_MINUTES);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("* Title can't be empty");
      return;
    }
    const clampedMinutes = Math.min(120, Math.max(1, Number.isFinite(estimatedMinutes) ? estimatedMinutes : DEFAULT_MINUTES));
    addChallenge({ title, category, difficulty, estimatedMinutes: clampedMinutes });
    setTitle("");
    setCategory(DEFAULT_CATEGORY);
    setDifficulty(DEFAULT_DIFFICULTY);
    setEstimatedMinutes(DEFAULT_MINUTES);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter challenge title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="form-row">
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Difficulty
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label>
          Time (min)
          <input
            type="number"
            min="1"
            max="120"
            value={estimatedMinutes}
            onChange={(e) => {
              const val = Number(e.target.value);
              setEstimatedMinutes(Number.isFinite(val) ? Math.min(120, Math.max(1, val)) : DEFAULT_MINUTES);
            }}
          />
        </label>
      </div>

      <button type="submit">Add Challenge</button>
    </form>
  );
};

export default AddChallenge;
