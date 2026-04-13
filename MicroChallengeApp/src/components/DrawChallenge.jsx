import React, { useContext, useMemo } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { Paper, Title, Text, Button, Badge, Group, Stack, Alert, Divider, Box } from "@mantine/core";

const STATUS_COLORS = { planned: "blue", in_progress: "yellow" };
const STATUS_LABELS = { planned: "Planned", in_progress: "In Progress" };

const cardHover = {
  root: {
    transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
    "&:hover": {
      boxShadow: "var(--mantine-shadow-md)",
      borderColor: "var(--mantine-color-teal-3)",
    },
  },
};

const DrawChallenge = () => {
  const { challengeList, selectedChallenge, drawMessage, drawNewChallenge, startChallenge, markChallengeAsCompleted } =
    useContext(ChallengeContext);

  const planned = useMemo(() => challengeList.filter((ch) => ch.status === "planned"), [challengeList]);

  const canDrawAgain = useMemo(() => {
    if (!selectedChallenge) return false;
    if (planned.length === 0) return false;
    if (planned.length >= 2) return true;
    const only = planned[0];
    return !(only.id === selectedChallenge.id && selectedChallenge.status === "planned");
  }, [planned, selectedChallenge]);

  const showNoMorePlannedCopy = Boolean(selectedChallenge && !canDrawAgain);

  return (
    <Stack gap="xl">
      <Stack gap={6}>
        <Title order={1} size="h2" fw={700}>
          Draw
        </Title>
        <Text size="sm" c="dimmed" maw={560}>
          One focused challenge for right now — draw from your planned list, then start or complete it here.
        </Text>
      </Stack>

      {drawMessage && (
        <Alert color="red" variant="light" radius="md" title="Can’t draw">
          {drawMessage}
        </Alert>
      )}

      {selectedChallenge ? (
        <Stack gap="lg">
          <Paper
            shadow="sm"
            p={{ base: "lg", sm: "xl" }}
            radius="lg"
            withBorder
            styles={{
              root: {
                background: "linear-gradient(145deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-white) 55%)",
                borderColor: "var(--mantine-color-teal-3)",
                ...cardHover.root,
              },
            }}
          >
            <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.8}>
              Your challenge right now
            </Text>

            <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md" mt="sm">
              <Title order={2} fz={{ base: "xl", sm: "h3" }} fw={800} style={{ flex: 1, minWidth: 0, letterSpacing: "-0.02em" }}>
                {selectedChallenge.title}
              </Title>
              <Badge size="lg" variant="filled" color="teal" radius="md" style={{ flexShrink: 0 }}>
                +{selectedChallenge.points} pts
              </Badge>
            </Group>

            <Group gap="xs" wrap="wrap" mt="md">
              <Badge size="sm" variant="light" color={STATUS_COLORS[selectedChallenge.status] || "gray"}>
                {STATUS_LABELS[selectedChallenge.status] || selectedChallenge.status}
              </Badge>
              <Badge size="sm" variant="light">
                {selectedChallenge.category}
              </Badge>
              <Badge size="sm" variant="light" color="orange">
                {selectedChallenge.difficulty}
              </Badge>
              <Badge size="sm" variant="light" color="gray">
                {selectedChallenge.timeCommitment}
              </Badge>
            </Group>
          </Paper>

          <Stack gap="md">
            {selectedChallenge.status === "planned" && (
              <Button
                color="blue"
                size="md"
                variant="filled"
                onClick={() => startChallenge(selectedChallenge.id)}
                miw={200}
                w={{ base: "100%", sm: "auto" }}
              >
                Start challenge
              </Button>
            )}
            {selectedChallenge.status === "in_progress" && (
              <Button
                color="green"
                size="md"
                variant="filled"
                onClick={() => markChallengeAsCompleted(selectedChallenge.id)}
                miw={200}
                w={{ base: "100%", sm: "auto" }}
              >
                Complete challenge
              </Button>
            )}

            {canDrawAgain && (
              <>
                <Divider label="More options" labelPosition="left" />
                <Box>
                  <Button
                    variant="light"
                    color="teal"
                    size="sm"
                    onClick={drawNewChallenge}
                    miw={180}
                    w={{ base: "100%", sm: "auto" }}
                  >
                    Draw again
                  </Button>
                  <Text size="xs" c="dimmed" mt={8} maw={420}>
                    Pick another random challenge from your planned list.
                  </Text>
                </Box>
              </>
            )}

            {showNoMorePlannedCopy && (
              <Paper p="md" radius="md" withBorder bg="gray.0">
                <Text size="sm" fw={600}>
                  No more planned challenges to draw.
                </Text>
                <Text size="xs" c="dimmed" mt={6}>
                  Start or complete what you have, or add new challenges from Home.
                </Text>
              </Paper>
            )}
          </Stack>
        </Stack>
      ) : (
        <Paper
          p={{ base: "lg", sm: "xl" }}
          radius="lg"
          withBorder
          bg="gray.0"
          styles={{
            root: {
              borderStyle: "dashed",
              borderColor: "var(--mantine-color-gray-4)",
            },
          }}
        >
          <Stack gap="md" align="flex-start" maw={480}>
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.6}>
                Ready when you are
              </Text>
              <Text fw={600} mt={6}>
                No challenge drawn yet
              </Text>
              <Text size="sm" c="dimmed" mt={6}>
                Draw pulls one item from your <strong>planned</strong> challenges. Add a few on Home first if the list is
                empty.
              </Text>
            </div>
            <Button
              onClick={drawNewChallenge}
              size="md"
              color="teal"
              variant="filled"
              miw={200}
              w={{ base: "100%", sm: "auto" }}
            >
              Draw challenge
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default DrawChallenge;
