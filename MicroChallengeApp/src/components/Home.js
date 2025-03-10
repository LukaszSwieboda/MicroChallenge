import React from 'react';
import AddChallenge from './AddChallenge.js';  
import ChallengeList from './ChallengeList.js'; 

const Home = () => {
    return (
      <div className="container">
        <h1>Add Your Challenge</h1>
        <AddChallenge />
        <ChallengeList />
      </div>
    );
  };
  
  export default Home;
