import React, { useContext, useEffect, useRef } from "react";
import { Modal, Button, Stack, Text, Title, Paper, Box } from "@mantine/core";
import confetti from "canvas-confetti";
import { ChallengeContext } from "./ChallengeContext.jsx";
import { CONFETTI_COMPLETION, CONFETTI_RANK_BURST } from "../constants.js";

function fireCompletionConfetti() {
  confetti({ ...CONFETTI_COMPLETION });
}

function fireRankCelebrationBurst() {
  const cfg = CONFETTI_RANK_BURST;
  for (let i = 0; i < cfg.primaryBursts; i++) {
    setTimeout(() => {
      confetti({
        particleCount: cfg.particleCount,
        spread: cfg.spread,
        startVelocity: cfg.startVelocity,
        ticks: cfg.ticks,
        gravity: cfg.gravity,
        scalar: cfg.scalar,
        origin: cfg.origin,
        colors: cfg.colors,
      });
    }, i * cfg.burstDelayMs);
  }
  setTimeout(() => {
    confetti({ ...cfg.finale });
  }, cfg.primaryBursts * cfg.burstDelayMs + 40);
}

const CompletionFeedbackModal = () => {
  const { completionFeedback, clearCompletionFeedback } = useContext(ChallengeContext);
  const opened = !!completionFeedback;
  const lastFiredKey = useRef(null);

  useEffect(() => {
    if (!completionFeedback) return undefined;
    const key = `${completionFeedback.newTotalPoints}-${completionFeedback.earnedNewRank}`;
    if (lastFiredKey.current === key) return undefined;
    lastFiredKey.current = key;

    const id = requestAnimationFrame(() => {
      if (completionFeedback.earnedNewRank) {
        fireRankCelebrationBurst();
      } else {
        fireCompletionConfetti();
      }
    });

    return () => cancelAnimationFrame(id);
  }, [completionFeedback]);

  useEffect(() => {
    if (!completionFeedback) lastFiredKey.current = null;
  }, [completionFeedback]);

  const handleContinue = () => {
    clearCompletionFeedback();
  };

  const progressLine =
    completionFeedback && completionFeedback.nextTitle != null && completionFeedback.pointsToNext > 0
      ? `You're ${completionFeedback.pointsToNext} pts away from ${completionFeedback.nextTitle}`
      : null;

  const newTitleText = completionFeedback?.newTitle ?? completionFeedback?.currentTitle;

  return (
    <Modal
      opened={opened}
      onClose={handleContinue}
      centered
      closeOnClickOutside={false}
      padding="md"
      radius="md"
      title={null}
    >
      {completionFeedback && (
        <Stack gap={completionFeedback.earnedNewRank ? "sm" : "md"}>
          <Text size="xs" tt="uppercase" fw={600} c="dimmed" lts={0.8}>
            Challenge completed
          </Text>

          {completionFeedback.earnedNewRank ? (
            <Paper
              withBorder
              p="sm"
              radius="md"
              bg="gray.0"
              style={{ borderColor: "var(--mantine-color-yellow-3)" }}
            >
              <Stack gap={6} align="center">
                <Text size="10px" tt="uppercase" fw={700} c="dimmed" lts={1.2}>
                  New title unlocked
                </Text>

                <Box
                  bg="yellow.0"
                  style={{
                    borderRadius: "999px",
                    padding: "6px 14px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  }}
                >
                  <Text
                    component="span"
                    fz={44}
                    lh={1}
                    style={{
                      filter: "drop-shadow(0 2px 6px rgba(184, 134, 11, 0.35))",
                    }}
                    aria-hidden
                  >
                    🏆
                  </Text>
                </Box>

                <Title order={3} ta="center" c="yellow.9" mt={2} mb={0}>
                  Rank up!
                </Title>

                <Title order={2} ta="center" c="gray.9" fz="clamp(1.25rem, 4vw, 1.6rem)" lh={1.2} mt={0}>
                  {newTitleText}
                </Title>

                <Text size="sm" c="dimmed" ta="center" mt={2} mb={0}>
                  +{completionFeedback.pointsEarned} pts earned
                </Text>
              </Stack>
            </Paper>
          ) : (
            <Stack gap="xs" align="flex-start">
              <Title order={2} c="teal.8" fz="clamp(1.75rem, 5vw, 2.25rem)" lh={1.2} fw={800}>
                +{completionFeedback.pointsEarned} pts
              </Title>
            </Stack>
          )}

          {progressLine && (
            <Text size="xs" c="dimmed" lh={1.5} mt={completionFeedback.earnedNewRank ? 0 : undefined}>
              {progressLine}
            </Text>
          )}

          {!progressLine && !completionFeedback.earnedNewRank && (
            <Text size="xs" c="dimmed" lh={1.5}>
              You&apos;re now {completionFeedback.currentTitle}.
            </Text>
          )}

          <Button fullWidth mt={completionFeedback.earnedNewRank ? 0 : 4} onClick={handleContinue} color="teal">
            Continue
          </Button>
        </Stack>
      )}
    </Modal>
  );
};

export default CompletionFeedbackModal;
