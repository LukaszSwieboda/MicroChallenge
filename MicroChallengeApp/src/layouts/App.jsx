import React from "react";
import { ChallengeProvider } from "../components/ChallengeContext.jsx";
import { BrowserRouter as Router, Routes, Route, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { AppShell, Burger, Group, Title, NavLink, Badge, Text, Stack, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Home from "../components/Home.jsx";
import DrawChallenge from "../components/DrawChallenge.jsx";
import CompletedChallenges from "../components/CompletedChallenges.jsx";
import AIGenerator from "../components/AIGenerator.jsx";
import CompletionFeedbackModal from "../components/CompletionFeedbackModal.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/ai", label: "AI Generator", end: false },
  { to: "/draw", label: "Draw", end: false },
  { to: "/completed", label: "Completed", end: false },
];

const navLinkStyles = (theme, { active }) => ({
  root: {
    borderRadius: theme.radius.md,
    marginBottom: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    transition: "background-color 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease",
    borderLeft: active ? `3px solid ${theme.colors.teal[6]}` : "3px solid transparent",
    backgroundColor: active ? theme.colors.teal[0] : undefined,
    fontWeight: active ? 600 : 500,
    color: active ? theme.colors.teal[9] : theme.colors.gray[7],
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : undefined,
    "&:hover": {
      backgroundColor: active ? theme.colors.teal[0] : theme.colors.gray[0],
      transform: "translateX(2px)",
    },
  },
  label: {
    fontSize: theme.fontSizes.sm,
  },
});

const Navigation = ({ onNavigate }) => {
  const location = useLocation();

  const isActive = (to, end) => {
    if (end) return location.pathname === "/" || location.pathname === "";
    return location.pathname.startsWith(to);
  };

  return (
    <Stack gap={4} px={2} pt={8}>
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap={6} px={8} pb="sm" mb={4}>
        <Title order={4} size="h5" fw={800} style={{ letterSpacing: "-0.02em", lineHeight: 1.25 }}>
          Micro Challenge AI
        </Title>
        <Badge
          variant="outline"
          color="teal"
          size="sm"
          radius="xl"
          tt="none"
          px="sm"
          styles={{ root: { fontWeight: 600, letterSpacing: "0.02em", flexShrink: 0 } }}
        >
          v0.1
        </Badge>
      </Group>
      <Text size="xs" tt="uppercase" fw={700} c="dimmed" px={8} pb={4} lts={0.8}>
        Navigate
      </Text>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          component={RouterNavLink}
          to={item.to}
          end={item.end}
          label={item.label}
          active={isActive(item.to, item.end)}
          onClick={onNavigate}
          variant="subtle"
          color="gray"
          styles={navLinkStyles}
        />
      ))}
    </Stack>
  );
};

const AppContent = () => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      navbar={{
        width: { base: 192, sm: 196, lg: 208, xl: 228 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding={0}
      styles={(theme) => ({
        navbar: {
          borderRight: `1px solid ${theme.colors.gray[2]}`,
          background: `linear-gradient(180deg, ${theme.colors.gray[0]} 0%, ${theme.white} 40%)`,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.md,
        },
        main: {
          minWidth: 0,
          paddingTop: `calc(var(--app-shell-header-offset, 0rem) + var(--app-shell-padding, 0rem) + ${theme.spacing.md})`,
          paddingBottom: "var(--mantine-spacing-xl)",
          paddingLeft: `calc(var(--app-shell-navbar-offset, 0rem) + clamp(0.5rem, 1.25vw, 1.25rem))`,
          paddingRight: `calc(var(--app-shell-aside-offset, 0rem) + clamp(0.5rem, 1.25vw, 1.25rem))`,
          maxWidth: 1280,
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <AppShell.Navbar>
        <Navigation onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box hiddenFrom="sm" pb="xs">
          <Burger opened={opened} onClick={toggle} size="sm" aria-label="Toggle navigation" />
        </Box>
        <CompletionFeedbackModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<AIGenerator />} />
          <Route path="/draw" element={<DrawChallenge />} />
          <Route path="/completed" element={<CompletedChallenges />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

const App = () => {
  return (
    <ChallengeProvider>
      <Router basename="/MicroChallenge">
        <AppContent />
      </Router>
    </ChallengeProvider>
  );
};

export default App;
