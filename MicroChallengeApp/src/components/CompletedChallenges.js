import React, { useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.js"; 
import { Link } from "react-router-dom";

const CompletedChallenges = () => {
  const { completedChallenges } = useContext(ChallengeContext);

  return (
    <div className="completed-challenges">
      <h2>Completed Challenges</h2>
      {completedChallenges.length === 0 ? (
        <p>No challenges completed yet.</p>
      ) : (
        <ul>
          {completedChallenges.map((challenge) => (
            <li key={challenge.id}>{challenge.name}</li>
          ))}
        </ul>
      )}
      
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default CompletedChallenges;
