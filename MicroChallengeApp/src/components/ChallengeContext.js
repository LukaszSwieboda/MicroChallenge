import React, { createContext, useState, useEffect, useRef } from "react";
import { DEFAULT_CATEGORY, DEFAULT_DIFFICULTY, DEFAULT_MINUTES } from "../constants.js";

export const ChallengeContext = createContext();

const STORAGE_KEYS = {
  CHALLENGE_LIST: "mc_challengeList",
  COMPLETED: "mc_completedChallenges",
};

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const migrateChallenge = (ch) => ({
  id: ch.id || generateId(),
  title: ch.title || ch.name || "Untitled",
  category: ch.category || DEFAULT_CATEGORY,
  difficulty: ch.difficulty || DEFAULT_DIFFICULTY,
  estimatedMinutes: ch.estimatedMinutes ?? DEFAULT_MINUTES,
  done: ch.done ?? false,
  createdAt: ch.createdAt || new Date().toISOString(),
  ...(ch.completedAt ? { completedAt: ch.completedAt } : {}),
});

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded or private browsing — silently ignore */
  }
};

const loadFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.reduce((acc, item) => {
      try {
        acc.push(migrateChallenge(item));
      } catch {
        /* skip individual corrupt records instead of wiping all data */
      }
      return acc;
    }, []);
  } catch {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    return [];
  }
};

export const ChallengeProvider = ({ children }) => {
  const isInitialMount = useRef(true);

  const [challengeList, setChallengeList] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CHALLENGE_LIST)
  );
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(() =>
    loadFromStorage(STORAGE_KEYS.COMPLETED)
  );
  const [drawMessage, setDrawMessage] = useState(null);

  useEffect(() => {
    if (isInitialMount.current) return;
    saveToStorage(STORAGE_KEYS.CHALLENGE_LIST, challengeList);
  }, [challengeList]);

  useEffect(() => {
    if (isInitialMount.current) return;
    saveToStorage(STORAGE_KEYS.COMPLETED, completedChallenges);
  }, [completedChallenges]);

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  const addChallenge = ({ title, category, difficulty, estimatedMinutes }) => {
    if (!title.trim()) return;
    setChallengeList((prev) => [
      ...prev,
      {
        id: generateId(),
        title: title.trim(),
        category: category || DEFAULT_CATEGORY,
        difficulty: difficulty || DEFAULT_DIFFICULTY,
        estimatedMinutes: Number.isFinite(estimatedMinutes) ? Math.min(120, Math.max(1, estimatedMinutes)) : DEFAULT_MINUTES,
        done: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const editChallenge = (id, newTitle) => {
    setChallengeList((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, title: newTitle } : ch))
    );
    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge((prev) => ({ ...prev, title: newTitle }));
    }
  };

  const deleteChallenge = (id) => {
    setChallengeList((prev) => prev.filter((ch) => ch.id !== id));
    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge(null);
    }
  };

  const drawNewChallenge = () => {
    if (challengeList.length === 0) {
      setSelectedChallenge(null);
      setDrawMessage("No challenges to draw!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * challengeList.length);
    setSelectedChallenge(challengeList[randomIndex]);
    setDrawMessage(null);
  };

  const markChallengeAsCompleted = () => {
    if (!selectedChallenge) return;
    setCompletedChallenges((prev) => [
      ...prev,
      { ...selectedChallenge, done: true, completedAt: new Date().toISOString() },
    ]);
    setChallengeList((prev) =>
      prev.filter((ch) => ch.id !== selectedChallenge.id)
    );
    setSelectedChallenge(null);
  };

  return (
    <ChallengeContext.Provider
      value={{
        challengeList,
        selectedChallenge,
        drawMessage,
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
