import React, { useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.js";
import { Link } from "react-router-dom";
import ChallengeStats from "./ChallengeStats.js";

const CompletedChallenges = () => {
  const { completedChallenges } = useContext(ChallengeContext);

  return (
    <div className="completed-challenges">
      <h2>Completed Challenges</h2>
      <ChallengeStats />
      {completedChallenges.length === 0 ? (
        <p>No challenges completed yet.</p>
      ) : (
        <ul>
          {completedChallenges.map((challenge) => (
            <li key={challenge.id}>
              <div>
                <strong>{challenge.title}</strong>
                <div style={{ fontSize: "0.85em", color: "#666", marginTop: "2px" }}>
                  {challenge.category} · {challenge.difficulty} · {challenge.estimatedMinutes} min
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default CompletedChallenges;
