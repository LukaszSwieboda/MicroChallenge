import React, { useContext, useMemo } from "react";
import {
  ChallengeContext,
  getCurrentTitle,
  getPointsToNextTitle,
  getMilestoneProgress,
  getNextTitle,
} from "../components/ChallengeContext.jsx";
import { DIFFICULTIES } from "../constants.js";
import { SimpleGrid, Paper, Text, Group, Stack, Box, Progress } from "@mantine/core";

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

const StatTile = ({ label, value, helper, accent = "teal" }) => (
  <Paper
    p="sm"
    radius="md"
    withBorder
    bg={`${accent}.0`}
    style={{
      minHeight: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderColor: "var(--mantine-color-gray-3)",
    }}
  >
    <Text size="10px" tt="uppercase" fw={700} c="dimmed" lts={0.5}>
      {label}
    </Text>
    <Box>
      <Text fw={800} size="xl" c={`${accent}.8`} lh={1.2} lineClamp={2}>
        {value}
      </Text>
      {helper && (
        <Text size="xs" c="dimmed" mt={6}>
          {helper}
        </Text>
      )}
    </Box>
  </Paper>
);

const ChallengeStats = () => {
  const { challengeList, completedChallenges } = useContext(ChallengeContext);

  const stats = useMemo(() => {
    const total = completedChallenges.length;
    const active = challengeList.length;
    const all = active + total;

    const rate = all > 0 ? Math.round((total / all) * 100) : 0;

    const totalPoints = completedChallenges.reduce((sum, ch) => sum + (ch.points || 0), 0);

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

    const currentTitle = getCurrentTitle(totalPoints);
    const pointsToNextTitle = getPointsToNextTitle(totalPoints);
    const milestoneProgress = getMilestoneProgress(totalPoints);
    const nextRank = getNextTitle(totalPoints);

    return {
      total,
      rate,
      totalPoints,
      currentTitle,
      pointsToNextTitle,
      favoriteCategory,
      difficultyBreakdown,
      streak,
      milestoneProgress,
      nextRank,
    };
  }, [challengeList, completedChallenges]);

  if (stats.total === 0) return null;

  const diffTotal = Math.max(
    1,
    stats.difficultyBreakdown.Easy + stats.difficultyBreakdown.Medium + stats.difficultyBreakdown.Hard
  );

  return (
    <Paper
      shadow="sm"
      p={{ base: "md", sm: "lg" }}
      radius="lg"
      withBorder
      mb="md"
      styles={{
        root: {
          background: "linear-gradient(180deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-white) 100%)",
          borderColor: "var(--mantine-color-teal-2)",
        },
      }}
    >
      <Stack gap="md">
        <div>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.6}>
            Your progress
          </Text>
          <Text fw={600} size="lg" mt={4}>
            At a glance
          </Text>
        </div>

        <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="sm">
          <StatTile label="Completed" value={stats.total} accent="teal" helper="Finished challenges" />
          <StatTile label="Points" value={stats.totalPoints} accent="teal" helper="Total score" />
          <StatTile label="Current title" value={stats.currentTitle} accent="yellow" helper="Rank" />
          <StatTile
            label="Pts to next title"
            value={stats.pointsToNextTitle === 0 ? "—" : stats.pointsToNextTitle}
            accent="green"
            helper={stats.pointsToNextTitle === 0 ? "Top rank" : "To next milestone"}
          />
          <StatTile label="Completion rate" value={`${stats.rate}%`} accent="blue" helper="Done vs active" />
          <StatTile label="Day streak" value={stats.streak} accent="orange" helper="Consecutive days" />
          <StatTile label="Top category" value={stats.favoriteCategory} accent="grape" helper="Most completed" />
        </SimpleGrid>

        {stats.nextRank != null && (
          <Box>
            <Text size="xs" c="dimmed" mb={6}>
              Progress toward <Text span fw={600}>{stats.nextRank.title}</Text>
            </Text>
            <Progress
              value={stats.milestoneProgress * 100}
              color="teal"
              size="sm"
              radius="xl"
              aria-label="Progress to next title"
            />
          </Box>
        )}

        <Paper p="sm" radius="md" withBorder bg="gray.0">
          <Text size="xs" fw={600} c="dimmed" mb="xs" tt="uppercase" lts={0.5}>
            Difficulty breakdown
          </Text>
          <Group gap="sm" wrap="wrap" justify={{ base: "center", sm: "flex-start" }}>
            {DIFFICULTIES.map((d) => {
              const n = stats.difficultyBreakdown[d];
              const pct = Math.round((n / diffTotal) * 100);
              return (
                <Paper
                  key={d}
                  px="md"
                  py="xs"
                  radius="md"
                  withBorder
                  bg="white"
                  style={{ minWidth: 108, borderColor: "var(--mantine-color-gray-3)" }}
                >
                  <Text size="10px" tt="uppercase" fw={700} c="dimmed">
                    {d}
                  </Text>
                  <Text fw={800} size="lg" c="teal.8" lh={1.2}>
                    {n}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {pct}% of completed
                  </Text>
                </Paper>
              );
            })}
          </Group>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default ChallengeStats;
