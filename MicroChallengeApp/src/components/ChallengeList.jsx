import React, { useContext, useState } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { CATEGORIES } from "../constants.js";
import {
  Paper,
  Group,
  Text,
  Badge,
  Button,
  TextInput,
  Select,
  Stack,
  Title,
  Box,
} from "@mantine/core";

const STATUS_COLORS = { planned: "blue", in_progress: "yellow", completed: "green" };
const STATUS_LABELS = { planned: "Planned", in_progress: "In Progress", completed: "Completed" };

const cardHoverStyles = {
  root: {
    transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
    "&:hover": {
      boxShadow: "var(--mantine-shadow-md)",
      transform: "translateY(-1px)",
      borderColor: "var(--mantine-color-gray-4)",
    },
  },
};

const ChallengeList = () => {
  const { challengeList, editChallenge, deleteChallenge, startChallenge, markChallengeAsCompleted } =
    useContext(ChallengeContext);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const filteredList =
    filterCategory === "All"
      ? challengeList
      : challengeList.filter((ch) => ch.category === filterCategory);

  const handleEditClick = (id, currentTitle) => {
    setEditingId(id);
    setEditedTitle(currentTitle);
  };

  const handleSaveEdit = (id) => {
    if (!editedTitle.trim()) return;
    editChallenge(id, editedTitle);
    setEditingId(null);
  };

  return (
    <Stack gap="md">
      <Stack gap={6}>
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <div>
            <Title order={3}>Your challenges</Title>
            <Text size="sm" c="dimmed" mt={4} maw={520} lh={1.55}>
              {challengeList.length === 0
                ? "Nothing here yet — use the form at the top or add a curated idea from the section just above."
                : "Start what you’re ready for, edit titles anytime, or filter by category."}
            </Text>
          </div>
          {challengeList.length > 0 && (
            <Select
              size="xs"
              data={["All", ...CATEGORIES]}
              value={filterCategory}
              onChange={(val) => setFilterCategory(val || "All")}
              allowDeselect={false}
              w={{ base: "100%", sm: 180 }}
              miw={160}
            />
          )}
        </Group>
      </Stack>

      {challengeList.length === 0 ? (
        <Paper p="xl" radius="md" withBorder bg="gray.0">
          <Stack gap="sm" align="flex-start">
            <Text fw={600}>No active challenges</Text>
            <Text size="sm" c="dimmed" maw={480}>
              Create your first challenge using the form at the top, or pick a starter from the examples section above.
            </Text>
          </Stack>
        </Paper>
      ) : filteredList.length === 0 ? (
        <Paper p="md" radius="md" withBorder bg="gray.0">
          <Text size="sm" c="dimmed">
            No challenges in this category. Try another filter or add a new challenge.
          </Text>
        </Paper>
      ) : (
        <Stack gap="sm">
          {filteredList.map((challenge) => (
            <Paper
              key={challenge.id}
              shadow="sm"
              p="md"
              radius="md"
              withBorder
              styles={cardHoverStyles}
            >
              {editingId === challenge.id ? (
                <Group align="flex-end" wrap="wrap" gap="xs">
                  <TextInput
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.currentTarget.value)}
                    style={{ flex: "1 1 200px" }}
                    size="sm"
                    label="Title"
                  />
                  <Button size="sm" onClick={() => handleSaveEdit(challenge.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="default" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </Group>
              ) : (
                <Stack gap="sm">
                  <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
                    <Text fw={600} size="sm" lineClamp={2} style={{ flex: 1, minWidth: 0 }}>
                      {challenge.title}
                    </Text>
                    <Badge size="md" variant="filled" color="teal" style={{ flexShrink: 0 }}>
                      {challenge.points} pts
                    </Badge>
                  </Group>

                  <Group gap={6} wrap="wrap">
                    <Badge size="xs" color={STATUS_COLORS[challenge.status] || "gray"} variant="light">
                      {STATUS_LABELS[challenge.status] || challenge.status}
                    </Badge>
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

                  <Box pt={4}>
                    <Group gap="xs" wrap="wrap" justify={{ base: "stretch", sm: "flex-start" }}>
                      {challenge.status === "planned" && (
                        <Button
                          size="xs"
                          variant="filled"
                          color="blue"
                          onClick={() => startChallenge(challenge.id)}
                          w={{ base: "100%", sm: "auto" }}
                        >
                          Start
                        </Button>
                      )}
                      {challenge.status === "in_progress" && (
                        <Button
                          size="xs"
                          variant="filled"
                          color="green"
                          onClick={() => markChallengeAsCompleted(challenge.id)}
                          w={{ base: "100%", sm: "auto" }}
                        >
                          Complete
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="default"
                        onClick={() => handleEditClick(challenge.id, challenge.title)}
                        w={{ base: "100%", sm: "auto" }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="gray"
                        onClick={() => deleteChallenge(challenge.id)}
                        styles={{
                          root: {
                            color: "var(--mantine-color-red-7)",
                          },
                        }}
                        w={{ base: "100%", sm: "auto" }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Box>
                </Stack>
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ChallengeList;
