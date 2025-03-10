import React, { useState, useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.js"; 

const AddChallenge = () => {
  const { addChallenge } = useContext(ChallengeContext);
  const [newChallenge, setNewChallenge] = useState("");
  const [error, setError] = useState("");

  const handleAddChallenge = () => {
    if (!newChallenge.trim()) {
      setError("* Field can't be empty");
      return;
    }
    addChallenge(newChallenge);
    setNewChallenge("");
    setError("");
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter a challenge name"
        value={newChallenge}
        onChange={(e) => setNewChallenge(e.target.value)}
      />
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={handleAddChallenge}>Add Challenge</button>
    </>
  );
};

export default AddChallenge;
