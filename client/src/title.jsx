import React from "react";
import "./title.css"; // Importing the CSS for styling

export const Title = ({ handleLogout }) => {
  return (
    <div className="title-bar">
      <h1>OfficebuddyAI</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};
