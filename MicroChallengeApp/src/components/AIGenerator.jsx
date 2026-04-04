import React, { useState, useContext, useRef } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { CATEGORIES, DIFFICULTIES, TIME_COMMITMENTS, DEFAULT_CATEGORY, DEFAULT_TIME_COMMITMENT } from "../constants.js";
import {
  generateChallengeSuggestions,
  isUsingRealAPI,
  getApiKey,
  setApiKey,
} from "../services/aiService.js";
import { Link } from "react-router-dom";

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
    <div className="ai-generator">
      <h2>AI Challenge Generator</h2>

      <div className="ai-mode-badge">
        {isUsingRealAPI() ? "OpenAI API" : "Demo Mode"}
        <button
          type="button"
          className="ai-key-toggle"
          onClick={() => setShowKeyInput(!showKeyInput)}
        >
          {showKeyInput ? "Hide" : "API Key"}
        </button>
      </div>

      {showKeyInput && (
        <div className="ai-key-section">
          <input
            type="password"
            placeholder="sk-..."
            value={apiKeyDraft}
            onChange={(e) => setApiKeyDraft(e.target.value)}
          />
          <button type="button" onClick={handleSaveKey}>
            {apiKeyDraft.trim() ? "Save Key" : "Clear Key"}
          </button>
        </div>
      )}

      <form onSubmit={handleGenerate}>
        <input
          type="text"
          placeholder="What's your goal? (e.g. improve focus, learn guitar)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

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
            Time
            <select value={timeCommitment} onChange={(e) => setTimeCommitment(e.target.value)}>
              {TIME_COMMITMENTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label>
            Difficulty
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Any</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Suggestions"}
        </button>
      </form>

      {error && <p className="ai-error">{error}</p>}

      {suggestions.length > 0 && (
        <div className="ai-suggestions">
          <h3>Suggestions</h3>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i} className="ai-suggestion-item">
                <div>
                  <strong>{s.title}</strong>
                  <div style={{ fontSize: "0.85em", color: "#666", marginTop: "2px" }}>
                    {s.category} · {s.difficulty} · {s.timeCommitment}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSave(s, i)}
                  disabled={savedIndexes.has(i)}
                >
                  {savedIndexes.has(i) ? "Saved" : "Save"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <p style={{ color: "#888", fontStyle: "italic", marginTop: "16px" }}>
          Describe your goal and generate AI-powered challenge ideas.
        </p>
      )}

      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default AIGenerator;
