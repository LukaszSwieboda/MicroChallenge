import React, { useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.js";
import { Link } from "react-router-dom";

const DrawChallenge = () => {
  const { selectedChallenge, drawMessage, drawNewChallenge, markChallengeAsCompleted } =
    useContext(ChallengeContext);

  return (
    <div className="draw-challenge">
      <h2>Draw a Challenge</h2>
      <button onClick={drawNewChallenge}>Draw Challenge</button>
      <p>Today's Challenge:</p>
      {drawMessage ? (
        <p style={{ color: "red" }}>{drawMessage}</p>
      ) : selectedChallenge ? (
        <div style={{ margin: "10px 0" }}>
          <p><strong>{selectedChallenge.title}</strong></p>
          <p style={{ fontSize: "0.9em", color: "#555" }}>
            {selectedChallenge.category} · {selectedChallenge.difficulty} · {selectedChallenge.estimatedMinutes} min
          </p>
        </div>
      ) : (
        <p>No challenge drawn yet</p>
      )}
      <button onClick={markChallengeAsCompleted} disabled={!selectedChallenge}>
        Mark as Completed
      </button>

      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default DrawChallenge;
