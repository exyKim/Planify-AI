import React, { useState } from 'react';
import "../styles/AddContentModal.css";

const AddContentModal = ({ onClose, onSubmit }) => {
  const [contentType, setContentType] = useState('A');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [memo, setMemo] = useState('');   // ⭐ memo 추가

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ contentType, date, content, memo });   // ⭐ memo 함께 전달
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Add Content</h2>
        <p className="modal-subtitle">테스크를 추가하시겠습니까?</p>
        
        <form className="modal-form" onSubmit={handleSubmit}>

          {/* A / T 선택 */}
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="A"
                checked={contentType === 'A'}
                onChange={(e) => setContentType(e.target.value)}
              />
              A
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="T"
                checked={contentType === 'T'}
                onChange={(e) => setContentType(e.target.value)}
              />
              T
            </label>
          </div>

          {/* 날짜 */}
          <label>When is the Date?</label>
          <input
            type="date"
            className="modal-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* 제목 */}
          <label>What is the content?</label>
          <input
            type="text"
            className="modal-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* ⭐ memo 추가 */}
          <label>memo :</label>
          <input
            type="text"
            className="modal-input"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />

          <div className="modal-buttons">
            <button type="button" className="modal-button cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-button done-button">
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentModal;
