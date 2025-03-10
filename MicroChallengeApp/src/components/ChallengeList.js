import React, { useContext, useEffect, useState } from "react";
import { ChallengeContext } from "../components/ChallengeContext.js"; 

const ChallengeList = () => {
  const { challengeList, editChallenge, deleteChallenge } = useContext(ChallengeContext);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    console.log("Challenge list updated:", challengeList);
  }, [challengeList]); 

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const handleSaveEdit = (id) => {
    if (!editedName.trim()) return;
    editChallenge(id, editedName);
    setEditingId(null);
  };

  return (
    <div>
      <p>List of challenges:</p>
      <ul>
        {challengeList.map((challenge) => (
          <li key={challenge.id}>
            {editingId === challenge.id ? (
              <>
                <input 
                  type="text" 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(challenge.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {challenge.name}
                <button onClick={() => handleEditClick(challenge.id, challenge.name)}>Edit</button>
                <button onClick={() => deleteChallenge(challenge.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeList;
