import React, { useContext } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { Paper, Title, Text, Button, Badge, Group, Stack, Alert } from "@mantine/core";

const DrawChallenge = () => {
  const { selectedChallenge, drawMessage, drawNewChallenge, startChallenge, markChallengeAsCompleted } =
    useContext(ChallengeContext);

  return (
    <Stack gap="lg">
      <Title order={2}>Draw a Challenge</Title>

      <Paper shadow="xs" p="lg" withBorder ta="center">
        <Button onClick={drawNewChallenge} size="md" mb="md">
          Draw Challenge
        </Button>

        <Text fw={600} mb="xs">Today's Challenge:</Text>

        {drawMessage ? (
          <Alert color="red" variant="light">{drawMessage}</Alert>
        ) : selectedChallenge ? (
          <Paper shadow="xs" p="md" bg="gray.0" radius="md">
            <Text fw={700} size="lg">{selectedChallenge.title}</Text>
            <Group gap={6} mt="xs" justify="center">
              <Badge variant="light">{selectedChallenge.category}</Badge>
              <Badge variant="light" color="orange">{selectedChallenge.difficulty}</Badge>
              <Badge variant="light" color="gray">{selectedChallenge.timeCommitment}</Badge>
              <Badge variant="filled" color="teal">{selectedChallenge.points} pts</Badge>
            </Group>
          </Paper>
        ) : (
          <Text c="dimmed">No challenge drawn yet</Text>
        )}

        {selectedChallenge && selectedChallenge.status === "planned" && (
          <Button color="blue" mt="md" onClick={() => startChallenge(selectedChallenge.id)}>
            Start Challenge
          </Button>
        )}
        {selectedChallenge && selectedChallenge.status === "in_progress" && (
          <Button color="green" mt="md" onClick={() => markChallengeAsCompleted(selectedChallenge.id)}>
            Mark as Completed
          </Button>
        )}
      </Paper>
    </Stack>
  );
};

export default DrawChallenge;
