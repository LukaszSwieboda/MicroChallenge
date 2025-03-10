import React, { useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.js"; 
import { Link } from "react-router-dom";

const DrawChallenge = () => {
  const { selectedChallenge, drawNewChallenge, markChallengeAsCompleted } =
    useContext(ChallengeContext);

  return (
    <div className="draw-challenge">
      <h2>Draw a Challenge</h2>
      <button onClick={drawNewChallenge}>Draw Challenge</button>
      <p>Today's Challenge:</p>
      <p style={{ color: selectedChallenge === "No challenges to draw!" ? "red" : "black" }}>
        {selectedChallenge || "No challenge drawn yet"}
      </p>
      <button onClick={markChallengeAsCompleted} disabled={!selectedChallenge}>
        Mark as Completed
      </button>

      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default DrawChallenge;
