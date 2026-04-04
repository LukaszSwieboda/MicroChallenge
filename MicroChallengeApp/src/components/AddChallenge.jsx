import React, { useState, useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { CATEGORIES, DIFFICULTIES, TIME_COMMITMENTS, DEFAULT_CATEGORY, DEFAULT_DIFFICULTY, DEFAULT_TIME_COMMITMENT } from "../constants.js";

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
      setError("* Title can't be empty");
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
          Time
          <select value={timeCommitment} onChange={(e) => setTimeCommitment(e.target.value)}>
            {TIME_COMMITMENTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit">Add Challenge</button>
    </form>
  );
};

export default AddChallenge;
