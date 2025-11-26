# 1) Node 공식 이미지 (Koyeb 권장 버전)
FROM node:18

# 2) 작업 디렉토리
WORKDIR /app

# 3) package.json 먼저 복사 → 의존성 설치
COPY package.json package-lock.json* ./

# 4) llama-node 설치를 위한 필수 빌드 도구
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 5) node_modules 설치
RUN npm install

# 6) TinyLlama gguf 모델 포함
COPY tinyllama-1.1b-chat-v1.0.Q4_0.gguf /app/tinyllama-1.1b-chat-v1.0.Q4_0.gguf

# 7) backend 코드 추가
COPY . .

# 8) Koyeb은 PORT 환경 변수를 자동으로 넣어줌
ENV PORT=3001

EXPOSE 3001

# 9) 서버 실행
CMD ["node", "server.js"]
