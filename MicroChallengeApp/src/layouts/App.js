import React from "react";
import { ChallengeProvider } from "../components/ChallengeContext.js"; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "../components/Home.js"; 
import DrawChallenge from '../components/DrawChallenge.js'; 
import CompletedChallenges from '../components/CompletedChallenges.js'; 
import AppStyles from '../styles/AppStyles.css';

const App = () => {
  return (
    <ChallengeProvider>
      {/* Ustawienie basename na /MicroChallenge */}
      <Router basename="/MicroChallenge">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/draw">Draw Challenge</Link></li>
            <li><Link to="/completed">Completed Challenges</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/draw" element={<DrawChallenge />} />
          <Route path="/completed" element={<CompletedChallenges />} />
        </Routes>
      </Router>
    </ChallengeProvider>
  );
};

export default App;
