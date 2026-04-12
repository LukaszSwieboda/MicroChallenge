import React, { useContext } from "react";
import { Title, Stack, Paper, Text, Badge, Button, Group, SimpleGrid } from "@mantine/core";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { EXAMPLE_CHALLENGES } from "../constants.js";
import AddChallenge from "./AddChallenge.jsx";
import ChallengeList from "./ChallengeList.jsx";

const Home = () => {
  const { challengeList, addChallenge } = useContext(ChallengeContext);

  const handleAddAll = () => {
    for (const ex of EXAMPLE_CHALLENGES) {
      addChallenge(ex);
    }
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Add Your Challenge</Title>
      <AddChallenge />
      <ChallengeList />

      {challengeList.length === 0 && (
        <Stack gap="sm" mt="md">
          <Group justify="space-between" align="center">
            <Title order={4}>Example challenges</Title>
            <Button size="xs" variant="light" onClick={handleAddAll}>
              Add all examples
            </Button>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {EXAMPLE_CHALLENGES.map((ex, i) => (
              <Paper key={i} shadow="xs" p="sm" withBorder>
                <Group justify="space-between" wrap="nowrap" align="flex-start">
                  <div>
                    <Text fw={600} size="sm">{ex.title}</Text>
                    <Group gap={6} mt={4}>
                      <Badge size="xs" variant="light">{ex.category}</Badge>
                      <Badge size="xs" variant="light" color="orange">{ex.difficulty}</Badge>
                      <Badge size="xs" variant="light" color="gray">{ex.timeCommitment}</Badge>
                    </Group>
                  </div>
                  <Button size="xs" variant="light" color="green" onClick={() => addChallenge(ex)}>
                    Add
                  </Button>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
};

export default Home;
