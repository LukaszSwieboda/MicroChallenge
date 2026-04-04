import React, { useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { Stack, Title, Text, Paper, Badge, Group } from "@mantine/core";
import ChallengeStats from "./ChallengeStats.jsx";

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
              <Text fw={600} size="sm">{challenge.title}</Text>
              <Group gap={6} mt={2}>
                <Badge size="xs" variant="light">{challenge.category}</Badge>
                <Badge size="xs" variant="light" color="orange">{challenge.difficulty}</Badge>
                <Badge size="xs" variant="light" color="gray">{challenge.timeCommitment}</Badge>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default CompletedChallenges;
