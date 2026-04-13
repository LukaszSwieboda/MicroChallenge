import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChallengeContext, getTotalPoints, getCurrentTitle } from "../components/ChallengeContext.jsx";
import { Stack, Title, Text, Paper, Badge, Group, Button } from "@mantine/core";
import ChallengeStats from "./ChallengeStats.jsx";

const formatDate = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return null;
  }
};

const cardHover = {
  root: {
    transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
    "&:hover": {
      boxShadow: "var(--mantine-shadow-md)",
      transform: "translateY(-1px)",
      borderColor: "var(--mantine-color-gray-4)",
    },
  },
};

const CompletedChallenges = () => {
  const { completedChallenges } = useContext(ChallengeContext);

  const summary = useMemo(() => {
    const pts = getTotalPoints(completedChallenges);
    const title = getCurrentTitle(pts);
    return { pts, title };
  }, [completedChallenges]);

  return (
    <Stack gap="xl">
      <Stack gap={6}>
        <Title order={1} size="h2" fw={700}>
          Completed
        </Title>
        <Text size="sm" c="dimmed" maw={560}>
          Your achievement history — every finished challenge, with points and how you tagged it.
        </Text>
      </Stack>

      <ChallengeStats />

      {completedChallenges.length > 0 && (
        <Paper
          shadow="sm"
          p={{ base: "md", sm: "lg" }}
          radius="lg"
          withBorder
          styles={{
            root: {
              background: "linear-gradient(145deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-gray-0) 100%)",
              borderColor: "var(--mantine-color-teal-2)",
            },
          }}
        >
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.6}>
            Summary
          </Text>
          <Text size="sm" mt="xs" maw={520}>
            You&apos;ve earned{" "}
            <Text span fw={800} c="teal.8">
              {summary.pts}
            </Text>{" "}
            points and hold the title{" "}
            <Text span fw={700}>
              {summary.title}
            </Text>
            .
          </Text>
        </Paper>
      )}

      {completedChallenges.length === 0 ? (
        <Paper p="xl" radius="md" withBorder bg="gray.0">
          <Stack gap="md" align="flex-start" maw={480}>
            <Text fw={600} size="lg">
              No completions yet
            </Text>
            <Text size="sm" c="dimmed">
              Finish a challenge from Home or Draw — completions show up here with points and your streak stats
              above once you have at least one.
            </Text>
            <Group gap="xs" mt="xs">
              <Button component={Link} to="/" variant="filled" color="teal" size="sm">
                Go to Home
              </Button>
              <Button component={Link} to="/draw" variant="light" color="teal" size="sm">
                Try Draw
              </Button>
            </Group>
          </Stack>
        </Paper>
      ) : (
        <Stack gap="sm">
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.6}>
            History
          </Text>
          {completedChallenges.map((challenge) => (
            <Paper key={challenge.id} shadow="sm" p="md" radius="md" withBorder styles={cardHover}>
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
                  <Text fw={600} size="sm" lineClamp={3} style={{ flex: 1, minWidth: 0 }}>
                    {challenge.title}
                  </Text>
                  <Badge size="lg" variant="filled" color="teal" style={{ flexShrink: 0 }}>
                    {challenge.points || 0} pts
                  </Badge>
                </Group>
                <Group gap={6} wrap="wrap">
                  <Badge size="xs" variant="light">
                    {challenge.category}
                  </Badge>
                  <Badge size="xs" variant="light" color="orange">
                    {challenge.difficulty}
                  </Badge>
                  <Badge size="xs" variant="light" color="gray">
                    {challenge.timeCommitment}
                  </Badge>
                </Group>
                {challenge.completedAt && (
                  <Text size="xs" c="dimmed">
                    Completed {formatDate(challenge.completedAt)}
                  </Text>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default CompletedChallenges;
