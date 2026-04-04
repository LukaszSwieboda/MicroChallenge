import React from "react";
import { ChallengeProvider } from "../components/ChallengeContext.jsx"; 
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from "../components/Home.jsx"; 
import DrawChallenge from '../components/DrawChallenge.jsx'; 
import CompletedChallenges from '../components/CompletedChallenges.jsx'; 
import AIGenerator from '../components/AIGenerator.jsx';
import '../styles/AppStyles.css';

const App = () => {
  return (
    <ChallengeProvider>
      {/* Ustawienie basename na /MicroChallenge */}
      <Router basename="/MicroChallenge">
        <nav>
          <ul>
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/ai">AI Generator</NavLink></li>
            <li><NavLink to="/draw">Draw</NavLink></li>
            <li><NavLink to="/completed">Completed</NavLink></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<AIGenerator />} />
          <Route path="/draw" element={<DrawChallenge />} />
          <Route path="/completed" element={<CompletedChallenges />} />
        </Routes>
      </Router>
    </ChallengeProvider>
  );
};

export default App;
