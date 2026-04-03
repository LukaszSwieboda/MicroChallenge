import React, { useContext, useState } from "react";
import { ChallengeContext } from "../components/ChallengeContext.js";
import { CATEGORIES } from "../constants.js";

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
      <div>
        <p style={{ color: "#888", fontStyle: "italic", marginTop: "20px" }}>
          No challenges yet. Add one above!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="list-header">
        <p>List of challenges ({filteredList.length}):</p>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredList.length === 0 ? (
        <p style={{ color: "#888", fontStyle: "italic" }}>
          No challenges in this category.
        </p>
      ) : (
        <ul>
          {filteredList.map((challenge) => (
            <li key={challenge.id}>
              {editingId === challenge.id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => handleSaveEdit(challenge.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>{challenge.title}</strong>
                    <div style={{ fontSize: "0.85em", color: "#666", marginTop: "2px" }}>
                      {challenge.category} · {challenge.difficulty} · {challenge.estimatedMinutes} min
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <button onClick={() => handleEditClick(challenge.id, challenge.title)}>Edit</button>
                    <button onClick={() => deleteChallenge(challenge.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChallengeList;
