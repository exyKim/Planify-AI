import React from "react";
import "../styles/ReminderCard.css";

const ReminderCard = ({ type, title, memo }) => {
  const styles = {
    "D-day": {
      bg: "#FEE9E9",
      badgeBg: "#FFE2E2",
      text: "#FF0000",
    },
    "D-1": {
      bg: "#FFFFE6",
      badgeBg: "#FEFFD0",
      text: "#F09400",
    },
    "D-2": {
      bg: "#DBFFE4",
      badgeBg: "#C0FFCF",
      text: "#00BB25",
    },
  };

  const s = styles[type] || styles["D-day"]; 

  return (
    <div className="reminder-card" style={{ backgroundColor: s.bg }}>
      <div className="reminder-row">
        <span
          className="reminder-badge"
          style={{ backgroundColor: s.badgeBg, color: s.text }}
        >
          {type}
        </span>

        <span className="reminder-title-text" style={{ color: s.text }}>
          {title}
        </span>
      </div>

      <div className="reminder-underline" style={{ borderColor: s.text }} />

      <div className="reminder-memo" style={{ color: s.text }}>
        {memo && memo.trim() !== "" ? memo : ""}
      </div>
    </div>
  );
};

export default ReminderCard;
