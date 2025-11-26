import React from "react";
import "../styles/TodoList.css";

import greenCheck from "../images/checked.svg";   // ✔ 완료
import redCircle from "../images/unchecked.svg";  // ⭕ 미완료

const TodoList = ({ items }) => {
  return (
    <div className="todo-list-grid">
      {items.map((item, idx) => (
        <div key={idx} className="todo-item">
          <img
            src={item.done ? greenCheck : redCircle}
            alt="status"
            className="todo-icon"
          />

          <span className={`todo-text ${item.done ? "done" : ""}`}>
            {item.content}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
