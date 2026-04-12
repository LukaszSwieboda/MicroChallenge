import React, { useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { Stack, Title, Text, Paper, Badge, Group } from "@mantine/core";
import ChallengeStats from "./ChallengeStats.jsx";

const formatDate = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return null;
  }
};

const CompletedChallenges = () => {
  const { completedChallenges } = useContext(ChallengeContext);

  return (
    <Stack gap="lg">
      <Title order={2}>Completed Challenges</Title>
      <ChallengeStats />
      {completedChallenges.length === 0 ? (
        <Text c="dimmed">No challenges completed yet.</Text>
      ) : (
        <Stack gap="xs">
          {completedChallenges.map((challenge) => (
            <Paper key={challenge.id} shadow="xs" p="sm" withBorder>
              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={600} size="sm">{challenge.title}</Text>
                  <Group gap={6} mt={2}>
                    <Badge size="xs" variant="light">{challenge.category}</Badge>
                    <Badge size="xs" variant="light" color="orange">{challenge.difficulty}</Badge>
                    <Badge size="xs" variant="light" color="gray">{challenge.timeCommitment}</Badge>
                    <Badge size="xs" variant="filled" color="teal">{challenge.points || 0} pts</Badge>
                  </Group>
                </div>
                {challenge.completedAt && (
                  <Text size="xs" c="dimmed">{formatDate(challenge.completedAt)}</Text>
                )}
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default CompletedChallenges;
