import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { LlamaModel, LlamaContext, LlamaChatSession } from "@llama-node/llama-cpp";
import path from "path";
import { fileURLToPath } from "url";

// ES Module 환경에서 __dirname 생성
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 모델 경로 (절대경로 금지 → Docker 내부 상대경로만)
const modelPath = path.join(__dirname, "tinyllama-1.1b-chat-v1.0.Q4_0.gguf");

let model;
let context;

// 모델 초기화
async function initModel() {
  if (model) return;
  model = new LlamaModel({
    modelPath: modelPath,
  });
  context = new LlamaContext({ model });
}

// AI 이메일 생성 API
app.post("/generate-mail", async (req, res) => {
  const { name, studentId, content, date } = req.body;

  if (!name || !studentId || !content || !date) {
    return res.status(400).json({ error: "모든 값을 입력해야 합니다." });
  }

  try {
    await initModel();
    const session = new LlamaChatSession({ context });

    const systemPrompt =
      "당신은 대학생이 교수님께 보내는 이메일을 대신 작성해주는 메일 작성 보조 시스템입니다.\n" +
      "아래 정보를 기반으로 정중한 톤의 이메일 제목과 본문을 생성하십시오.\n\n" +
      "규칙:\n" +
      "- 존댓말 사용\n" +
      "- 실제 대학생이 교수님께 보내는 자연스러운 톤\n" +
      "- '제목:' / '본문:' 형식 유지\n" +
      "- 안내 문장, 설명 문장 절대 금지\n";

    const userPrompt =
      `이름: ${name}\n학번: ${studentId}\n내용: ${content}\n날짜: ${date}\n\n` +
      "위 내용을 기반으로 이메일을 생성해 주세요.";

    const response = await session.prompt(systemPrompt + "\n" + userPrompt);

    // ✔️ 여기 반드시 email 키로 반환해야 프론트와 연결됨
    res.json({ email: response });

  } catch (err) {
    res.status(500).json({ error: "AI 생성 중 오류", detail: err.message });
  }
});

// Koyeb 는 PORT 환경 변수를 사용함
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`AI backend running on port ${PORT}`);
});
