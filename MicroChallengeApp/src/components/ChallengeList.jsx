import React, { useContext, useState } from "react";
import { ChallengeContext } from "../components/ChallengeContext.jsx";
import { CATEGORIES } from "../constants.js";
import { Paper, Group, Text, Badge, Button, TextInput, Select, Stack, Title } from "@mantine/core";

const ChallengeList = () => {
  const { challengeList, editChallenge, deleteChallenge } = useContext(ChallengeContext);
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

  if (challengeList.length === 0) {
    return (
      <Text c="dimmed" fs="italic" mt="md">
        No challenges yet. Add one above!
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Title order={4}>Challenges ({filteredList.length})</Title>
        <Select
          size="xs"
          data={["All", ...CATEGORIES]}
          value={filterCategory}
          onChange={(val) => setFilterCategory(val || "All")}
          allowDeselect={false}
          w={160}
        />
      </Group>

      {filteredList.length === 0 ? (
        <Text c="dimmed" fs="italic">No challenges in this category.</Text>
      ) : (
        <Stack gap="xs">
          {filteredList.map((challenge) => (
            <Paper key={challenge.id} shadow="xs" p="sm" withBorder>
              {editingId === challenge.id ? (
                <Group>
                  <TextInput
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.currentTarget.value)}
                    style={{ flex: 1 }}
                    size="sm"
                  />
                  <Button size="xs" onClick={() => handleSaveEdit(challenge.id)}>Save</Button>
                  <Button size="xs" variant="default" onClick={() => setEditingId(null)}>Cancel</Button>
                </Group>
              ) : (
                <Group justify="space-between" wrap="nowrap">
                  <div>
                    <Text fw={600} size="sm">{challenge.title}</Text>
                    <Group gap={6} mt={2}>
                      <Badge size="xs" variant="light">{challenge.category}</Badge>
                      <Badge size="xs" variant="light" color="orange">{challenge.difficulty}</Badge>
                      <Badge size="xs" variant="light" color="gray">{challenge.timeCommitment}</Badge>
                    </Group>
                  </div>
                  <Group gap={4} wrap="nowrap">
                    <Button size="xs" variant="light" onClick={() => handleEditClick(challenge.id, challenge.title)}>Edit</Button>
                    <Button size="xs" variant="light" color="red" onClick={() => deleteChallenge(challenge.id)}>Delete</Button>
                  </Group>
                </Group>
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ChallengeList;
