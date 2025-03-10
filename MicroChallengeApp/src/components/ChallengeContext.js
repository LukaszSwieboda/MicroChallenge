import React, { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [challengeList, setChallengeList] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const addChallenge = (name) => {
    if (!name.trim()) return;
    setChallengeList((prev) => [...prev, { id: uuidv4(), name }]);
  };

  const editChallenge = (id, newName) => {
    setChallengeList((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, name: newName } : ch))
    );
  };

  const deleteChallenge = (id) => {
    setChallengeList((prev) => prev.filter((ch) => ch.id !== id));
  };

  const drawNewChallenge = () => {
    if (challengeList.length === 0) {
      setSelectedChallenge("No challenges to draw!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * challengeList.length);
    setSelectedChallenge(challengeList[randomIndex].name);
  };

  const markChallengeAsCompleted = () => {
    if (!selectedChallenge) return;
    const challenge = challengeList.find((ch) => ch.name === selectedChallenge);
    if (challenge) {
      setCompletedChallenges((prev) => [...prev, challenge]);
      setSelectedChallenge(null);
    }
  };

  return (
    <ChallengeContext.Provider
      value={{
        challengeList,
        setChallengeList,  
        selectedChallenge,
        completedChallenges,
        addChallenge,
        editChallenge,
        deleteChallenge,
        drawNewChallenge,
        markChallengeAsCompleted,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};
