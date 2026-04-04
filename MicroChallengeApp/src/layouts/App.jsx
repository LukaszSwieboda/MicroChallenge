import React from "react";
import { ChallengeProvider } from "../components/ChallengeContext.jsx";
import { BrowserRouter as Router, Routes, Route, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { AppShell, Burger, Group, Title, NavLink, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Home from "../components/Home.jsx";
import DrawChallenge from "../components/DrawChallenge.jsx";
import CompletedChallenges from "../components/CompletedChallenges.jsx";
import AIGenerator from "../components/AIGenerator.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/ai", label: "AI Generator" },
  { to: "/draw", label: "Draw" },
  { to: "/completed", label: "Completed" },
];

const Navigation = ({ onNavigate }) => {
  const location = useLocation();

  const isActive = (to, end) => {
    if (end) return location.pathname === "/" || location.pathname === "";
    return location.pathname.startsWith(to);
  };

  return NAV_ITEMS.map((item) => (
    <NavLink
      key={item.to}
      component={RouterNavLink}
      to={item.to}
      end={item.end}
      label={item.label}
      active={isActive(item.to, item.end)}
      onClick={onNavigate}
      style={{ textDecoration: "none" }}
    />
  ));
};

const AppContent = () => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 220, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Micro Challenge AI</Title>
          </Group>
          <Badge variant="light" color="teal" size="sm">v0.1</Badge>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        <Navigation onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
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
