import { useState } from "react";
import axios from "axios";
import "../styles/mail.css";
import copyIcon from "../images/copy.svg";

export default function MailManager({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultMode, setResultMode] = useState(false);

  const [emailTitle, setEmailTitle] = useState("");
  const [emailBody, setEmailBody] = useState("");

  if (!isOpen) return null;

  // Copy to clipboard
  const handleCopy = () => {
    const fullText = `제목: ${emailTitle}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullText);
    alert("복사되었습니다!");
  };

  const handleDone = async () => {
    if (!name || !studentId || !content || !date) {
      alert("모든 값을 입력해 주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://decent-krystal-planify-4744019d.koyeb.app/generate-mail", {
        name,
        studentId,
        content,
        date
        })

      const text = response.data.email || "";

      // 제목/본문 구분
      const titleMatch = text.match(/제목:(.*)/);
      const bodyMatch = text.match(/본문:([\s\S]*)/);

      setEmailTitle(titleMatch ? titleMatch[1].trim() : "제목 생성 오류");
      setEmailBody(bodyMatch ? bodyMatch[1].trim() : text);

      setResultMode(true);
    } catch (err) {
      console.log("AI Error:", err);

      // GitHub Pages 등 백엔드 없을 때
      setEmailTitle("AI 기능 사용 불가");
      setEmailBody("현재 AI 서버에 연결할 수 없습니다.\n로컬에서 backend를 실행하면 정상 작동합니다.");

      setResultMode(true);
    }

    setLoading(false);
  };

  // back = 팝업 완전 닫기
  const handleBack = () => {
    // Reset states
    setName("");
    setStudentId("");
    setContent("");
    setDate("");
    setResultMode(false);
    onClose();
  };

  return (
    <div className="mail-overlay">
      <div className="mail-modal">

        {loading && (
          <div className="mail-loading">메일 생성 중...</div>
        )}

        {!loading && !resultMode && (
          <>
            <h2 className="mail-title">Mail Helper</h2>
            <p className="mail-subtitle">
              교수님께 드릴 메일 양식을 써 드리겠습니다. 어떤 메일을 보내시겠습니까?
            </p>

            <div className="mail-form">
              <input
                type="text"
                placeholder="이름"
                className="mail-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="학번"
                className="mail-input"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />

              <textarea
                placeholder="내용"
                className="mail-input mail-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <input
                type="date"
                className="mail-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="mail-buttons">
              <button className="mail-button cancel-mail" onClick={onClose}>
                Cancel
              </button>
              <button className="mail-button done-mail" onClick={handleDone}>
                Done
              </button>
            </div>
          </>
        )}

        {!loading && resultMode && (
          <>
            <h2 className="mail-title">메일이 생성되었습니다</h2>

            <div className="mail-result-box">
              <h3 className="mail-result-title">{emailTitle}</h3>
              <pre className="mail-result-body">{emailBody}</pre>
            </div>

            <div className="mail-buttons">
              <button className="mail-copy-btn" onClick={handleCopy}>
                <img src={copyIcon} alt="Copy" />
              </button>

              <button className="mail-button cancel-mail" onClick={handleBack}>
                Back
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
