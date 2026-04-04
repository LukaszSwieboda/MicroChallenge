import React, { useContext, useMemo } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { DIFFICULTIES } from "../constants.js";

const toLocalDateKey = (iso) => {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return null;
  }
};

const dateToKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const computeStreak = (challenges) => {
  const datesWithCompletions = new Set();
  for (const ch of challenges) {
    if (!ch.completedAt) continue;
    const day = toLocalDateKey(ch.completedAt);
    if (day) datesWithCompletions.add(day);
  }
  if (datesWithCompletions.size === 0) return 0;

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!datesWithCompletions.has(dateToKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!datesWithCompletions.has(dateToKey(cursor))) return 0;
  }

  let streak = 0;
  while (datesWithCompletions.has(dateToKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

const ChallengeStats = () => {
  const { challengeList, completedChallenges } = useContext(ChallengeContext);

  const stats = useMemo(() => {
    const total = completedChallenges.length;
    const active = challengeList.length;
    const all = active + total;

    const rate = all > 0 ? Math.round((total / all) * 100) : 0;

    const categoryCounts = {};
    for (const ch of completedChallenges) {
      categoryCounts[ch.category] = (categoryCounts[ch.category] || 0) + 1;
    }
    let favoriteCategory = "—";
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteCategory = cat;
      }
    }

    const difficultyBreakdown = {};
    for (const d of DIFFICULTIES) {
      difficultyBreakdown[d] = 0;
    }
    for (const ch of completedChallenges) {
      if (difficultyBreakdown[ch.difficulty] !== undefined) {
        difficultyBreakdown[ch.difficulty]++;
      }
    }

    const streak = computeStreak(completedChallenges);

    return { total, rate, favoriteCategory, difficultyBreakdown, streak };
  }, [challengeList, completedChallenges]);

  if (stats.total === 0) return null;

  return (
    <div className="stats-section">
      <h3>Your Progress</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.rate}%</span>
          <span className="stat-label">Completion Rate</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.streak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.favoriteCategory}</span>
          <span className="stat-label">Top Category</span>
        </div>
      </div>
      <div className="difficulty-breakdown">
        {DIFFICULTIES.map((d) => (
          <span key={d} className="difficulty-tag">
            {d}: {stats.difficultyBreakdown[d]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChallengeStats;
