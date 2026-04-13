import React, { useContext, useMemo } from "react";
import { Title, Stack, Paper, Text, Badge, Button, Group, SimpleGrid, Progress, Box, Divider } from "@mantine/core";
import {
  ChallengeContext,
  getTotalPoints,
  getCurrentTitle,
  getNextTitle,
  getPointsToNextTitle,
  getMilestoneProgress,
} from "../components/ChallengeContext.jsx";
import { EXAMPLE_CHALLENGES } from "../constants.js";
import AddChallenge from "./AddChallenge.jsx";
import ChallengeList from "./ChallengeList.jsx";

const Home = () => {
  const { challengeList, completedChallenges, addChallenge } = useContext(ChallengeContext);

  const progress = useMemo(() => {
    const totalPoints = getTotalPoints(completedChallenges);
    return {
      totalPoints,
      currentTitle: getCurrentTitle(totalPoints),
      nextTitle: getNextTitle(totalPoints),
      pointsToNext: getPointsToNextTitle(totalPoints),
      milestoneProgress: getMilestoneProgress(totalPoints),
    };
  }, [completedChallenges]);

  const handleAddAll = () => {
    for (const ex of EXAMPLE_CHALLENGES) {
      addChallenge(ex);
    }
  };

  return (
    <Stack gap="xl">
      <Stack gap="sm">
        <Text size="sm" c="dimmed" maw={520} lh={1.55}>
          Plan micro challenges, earn points, and keep momentum — all in one place.
        </Text>
        <Paper
          shadow="sm"
          p={{ base: "md", sm: "lg" }}
          radius="lg"
          withBorder
          styles={{
            root: {
              background: "linear-gradient(145deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-gray-0) 55%, var(--mantine-color-white) 100%)",
              borderColor: "var(--mantine-color-teal-2)",
            },
          }}
        >
          <Box
            pl={{ base: 0, sm: 12 }}
            style={{
              borderLeft: "3px solid var(--mantine-color-teal-5)",
            }}
          >
            <Text size="xs" c="dimmed" tt="uppercase" fw={700} lts={0.6}>
              Your progress
            </Text>
            <Text size="xs" c="dimmed" mt={6} maw={480} lh={1.5}>
              Points and rank from what you&apos;ve completed — track the next milestone below.
            </Text>
            <Group gap="md" align="flex-end" wrap="wrap" mt="sm">
              <div>
                <Text fw={900} fz={{ base: 34, sm: 40 }} lh={1} c="teal.9" style={{ letterSpacing: "-0.02em" }}>
                  {progress.totalPoints}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  total points
                </Text>
              </div>
              <Badge size="lg" variant="filled" color="teal" radius="sm" tt="none" px="sm" py={4}>
                {progress.currentTitle}
              </Badge>
            </Group>
            {progress.nextTitle != null ? (
              <>
                <Text size="sm" c="dimmed" mt="md">
                  Next milestone:{" "}
                  <Text span fw={600} c="gray.7">
                    {progress.nextTitle.title}
                  </Text>{" "}
                  ·{" "}
                  <Text span c="dimmed">
                    {progress.pointsToNext} pts to go
                  </Text>
                </Text>
                <Progress
                  value={progress.milestoneProgress * 100}
                  mt="sm"
                  size="sm"
                  radius="xl"
                  color="teal"
                  aria-label="Progress to next title"
                />
              </>
            ) : (
              <Text size="sm" c="dimmed" mt="md">
                You&apos;re at the top rank — keep completing challenges to grow your score.
              </Text>
            )}
          </Box>
        </Paper>
      </Stack>

      <Stack gap="sm">
        <Stack gap={4}>
          <Title order={3}>New challenge</Title>
          <Text size="sm" c="dimmed" maw={520} lh={1.55}>
            Add something concrete you can finish in one sitting or one day.
          </Text>
        </Stack>
        <AddChallenge />
      </Stack>

      {challengeList.length === 0 && (
        <Stack gap="md">
          <Divider labelPosition="left" label="Starter ideas" />
          <Stack gap={6}>
            <Title order={4}>Example challenges</Title>
            <Text size="sm" c="dimmed" maw={520} lh={1.55}>
              Not sure where to begin? Pick a curated idea below or add them all — you can edit titles anytime.
            </Text>
          </Stack>
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Curated for quick wins
            </Text>
            <Button size="xs" variant="light" color="teal" onClick={handleAddAll} w={{ base: "100%", xs: "auto" }}>
              Add all examples
            </Button>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {EXAMPLE_CHALLENGES.map((ex, i) => (
              <Paper
                key={i}
                shadow="sm"
                p="md"
                radius="md"
                withBorder
                styles={{
                  root: {
                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                  },
                }}
              >
                <Group justify="space-between" wrap="nowrap" align="flex-start" gap="md">
                  <div style={{ minWidth: 0 }}>
                    <Text fw={600} size="sm" lineClamp={3}>
                      {ex.title}
                    </Text>
                    <Group gap={6} mt={8}>
                      <Badge size="xs" variant="light">
                        {ex.category}
                      </Badge>
                      <Badge size="xs" variant="light" color="orange">
                        {ex.difficulty}
                      </Badge>
                      <Badge size="xs" variant="light" color="gray">
                        {ex.timeCommitment}
                      </Badge>
                    </Group>
                  </div>
                  <Button
                    size="xs"
                    variant="light"
                    color="teal"
                    onClick={() => addChallenge(ex)}
                    style={{ flexShrink: 0 }}
                  >
                    Add
                  </Button>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      )}

      <ChallengeList />
    </Stack>
  );
};

export default Home;
