import React, { createContext, useState, useEffect, useRef } from "react";
import {
  DEFAULT_CATEGORY, DEFAULT_DIFFICULTY, DEFAULT_TIME_COMMITMENT, DEFAULT_CHALLENGE_STATUS,
  TIME_COMMITMENTS, CHALLENGE_STATUSES, DIFFICULTY_POINTS, TIME_COMMITMENT_MULTIPLIERS,
} from "../constants.js";

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

export const calculatePoints = (difficulty, timeCommitment) => {
  const base = DIFFICULTY_POINTS[difficulty] || DIFFICULTY_POINTS.Easy;
  const mult = TIME_COMMITMENT_MULTIPLIERS[timeCommitment] || 1;
  return Math.round(base * mult);
};

const migrateTimeCommitment = (ch) => {
  if (ch.timeCommitment && TIME_COMMITMENTS.includes(ch.timeCommitment)) {
    return ch.timeCommitment;
  }
  const mins = ch.estimatedMinutes;
  if (typeof mins !== "number" || !Number.isFinite(mins)) return DEFAULT_TIME_COMMITMENT;
  if (mins <= 30) return "Quick win";
  if (mins <= 90) return "30–60 min";
  if (mins <= 300) return "Half day";
  return "Full day";
};

const inferStatus = (ch) => {
  if (CHALLENGE_STATUSES.includes(ch.status)) return ch.status;
  if (ch.done === true || ch.completedAt) return "completed";
  if (ch.startedAt) return "in_progress";
  return DEFAULT_CHALLENGE_STATUS;
};

const migrateChallenge = (ch) => {
  const difficulty = ch.difficulty || DEFAULT_DIFFICULTY;
  const timeCommitment = migrateTimeCommitment(ch);
  const status = inferStatus(ch);
  return {
    id: ch.id || generateId(),
    title: ch.title || ch.name || "Untitled",
    category: ch.category || DEFAULT_CATEGORY,
    difficulty,
    timeCommitment,
    status,
    points: typeof ch.points === "number" && Number.isFinite(ch.points) ? ch.points : calculatePoints(difficulty, timeCommitment),
    startedAt: ch.startedAt || (status !== "planned" ? ch.createdAt || null : null),
    done: ch.done ?? false,
    createdAt: ch.createdAt || new Date().toISOString(),
    ...(ch.completedAt ? { completedAt: ch.completedAt } : {}),
  };
};

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

  const addChallenge = ({ title, category, difficulty, timeCommitment }) => {
    if (!title.trim()) return;
    const diff = difficulty || DEFAULT_DIFFICULTY;
    const tc = TIME_COMMITMENTS.includes(timeCommitment) ? timeCommitment : DEFAULT_TIME_COMMITMENT;
    setChallengeList((prev) => [
      ...prev,
      {
        id: generateId(),
        title: title.trim(),
        category: category || DEFAULT_CATEGORY,
        difficulty: diff,
        timeCommitment: tc,
        status: DEFAULT_CHALLENGE_STATUS,
        points: calculatePoints(diff, tc),
        startedAt: null,
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

  const startChallenge = (id) => {
    setChallengeList((prev) =>
      prev.map((ch) =>
        ch.id === id
          ? { ...ch, status: "in_progress", startedAt: ch.startedAt || new Date().toISOString() }
          : ch
      )
    );
    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge((prev) => ({
        ...prev,
        status: "in_progress",
        startedAt: prev.startedAt || new Date().toISOString(),
      }));
    }
  };

  const drawNewChallenge = () => {
    const planned = challengeList.filter((ch) => ch.status === "planned");
    if (planned.length === 0) {
      setSelectedChallenge(null);
      setDrawMessage("No planned challenges to draw!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * planned.length);
    setSelectedChallenge(planned[randomIndex]);
    setDrawMessage(null);
  };

  const markChallengeAsCompleted = (id) => {
    const targetId = id || (selectedChallenge && selectedChallenge.id);
    if (!targetId) return;

    const target = challengeList.find((ch) => ch.id === targetId);
    if (!target) return;

    setCompletedChallenges((prev) => {
      if (prev.some((ch) => ch.id === targetId)) return prev;
      return [...prev, { ...target, status: "completed", done: true, completedAt: new Date().toISOString() }];
    });
    setChallengeList((prev) => prev.filter((ch) => ch.id !== targetId));

    if (selectedChallenge && selectedChallenge.id === targetId) {
      setSelectedChallenge(null);
    }
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
        startChallenge,
        drawNewChallenge,
        markChallengeAsCompleted,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};
