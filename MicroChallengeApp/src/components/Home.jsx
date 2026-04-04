import React from 'react';
import AddChallenge from './AddChallenge.jsx';  
import ChallengeList from './ChallengeList.jsx'; 

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
