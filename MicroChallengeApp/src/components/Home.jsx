import React from "react";
import { Title, Stack } from "@mantine/core";
import AddChallenge from "./AddChallenge.jsx";
import ChallengeList from "./ChallengeList.jsx";

const Home = () => {
  return (
    <Stack gap="lg">
      <Title order={2}>Add Your Challenge</Title>
      <AddChallenge />
      <ChallengeList />
    </Stack>
  );
};

export default Home;
