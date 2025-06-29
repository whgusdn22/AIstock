# 🚀 AI 주식 차트 분석기 설정 가이드

이 문서는 AI 주식 차트 분석기를 처음 설정하는 방법을 안내합니다.

## 📋 사전 요구사항

### 1. OpenAI API 키

- [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키를 발급받으세요
- API 키는 `sk-`로 시작하는 문자열입니다

### 2. 개발 환경

- **Python 3.8+**
- **Node.js 16+**
- **npm** 또는 **yarn**

## 🔧 자동 설정 (권장)

### 백엔드 설정

```bash
cd backend
python setup.py
```

### 프론트엔드 설정

```bash
node setup-frontend.js
```

## 🔧 수동 설정

### 1. 백엔드 설정

#### 1-1. 의존성 설치

```bash
cd backend
pip install -r requirements.txt
```

#### 1-2. 환경 변수 파일 생성

`backend/.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# OpenAI API 설정
OPENAI_API_KEY=sk-your-api-key-here

# 서버 설정
HOST=0.0.0.0
PORT=8000

# 로깅 설정
LOG_LEVEL=INFO

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000

# 분석 설정
MAX_IMAGE_SIZE=10485760  # 10MB
SUPPORTED_FORMATS=jpg,jpeg,png,gif
```

#### 1-3. 백엔드 서버 실행

```bash
python main.py
```

### 2. 프론트엔드 설정

#### 2-1. 의존성 설치

```bash
npm install
```

#### 2-2. 환경 변수 파일 생성

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 백엔드 서버 URL
BACKEND_URL=http://localhost:8000

# Next.js 설정
NEXT_PUBLIC_APP_NAME=AI 주식 차트 분석기
NEXT_PUBLIC_APP_VERSION=1.0.0

# 개발 환경 설정
NODE_ENV=development
```

#### 2-3. 프론트엔드 서버 실행

```bash
npm run dev
```

## 🧪 테스트

### 1. 백엔드 테스트

```bash
curl http://localhost:8000/health
```

예상 응답:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00",
  "openai_configured": true
}
```

### 2. 프론트엔드 테스트

브라우저에서 `http://localhost:3000`에 접속하여 웹사이트가 정상적으로 로드되는지 확인하세요.

## 🔍 문제 해결

### 백엔드 관련 문제

#### 1. OpenAI API 키 오류

```
ValueError: OPENAI_API_KEY가 설정되지 않았습니다.
```

**해결방법**: `backend/.env` 파일에 올바른 API 키를 입력하세요.

#### 2. 의존성 설치 오류

```
ModuleNotFoundError: No module named 'openai'
```

**해결방법**:

```bash
cd backend
pip install -r requirements.txt
```

#### 3. 포트 충돌

```
OSError: [Errno 98] Address already in use
```

**해결방법**: 다른 포트를 사용하거나 기존 프로세스를 종료하세요.

```bash
# 포트 8000 사용 중인 프로세스 확인
lsof -i :8000
# 프로세스 종료
kill -9 <PID>
```

### 프론트엔드 관련 문제

#### 1. 백엔드 연결 오류

```
백엔드 서버에 연결할 수 없습니다.
```

**해결방법**:

- 백엔드 서버가 실행 중인지 확인
- `.env.local`의 `BACKEND_URL`이 올바른지 확인

#### 2. 의존성 설치 오류

```
npm ERR! code ENOENT
```

**해결방법**:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📁 파일 구조

```
AI_stock/
├── backend/
│   ├── .env                    # 백엔드 환경 변수 (생성 필요)
│   ├── .env.example           # 환경 변수 예시
│   ├── setup.py               # 자동 설정 스크립트
│   ├── main.py                # FastAPI 서버
│   ├── ai_analyzer.py         # OpenAI API 분석기
│   ├── config.py              # 설정 관리
│   └── requirements.txt       # Python 의존성
├── .env.local                 # 프론트엔드 환경 변수 (생성 필요)
├── env.example                # 환경 변수 예시
├── setup-frontend.js          # 자동 설정 스크립트
└── src/                       # Next.js 프론트엔드
```

## ⚠️ 보안 주의사항

1. **API 키 보호**: `.env` 파일은 절대 Git에 커밋하지 마세요
2. **환경 변수**: 민감한 정보는 환경 변수로 관리하세요
3. **CORS 설정**: 프로덕션에서는 `ALLOWED_ORIGINS`를 적절히 설정하세요

## 💰 비용 정보

- **OpenAI API 사용량**: 이미지 분석 및 텍스트 생성에 따른 비용 발생
- **GPT-4 Vision**: 이미지당 약 $0.01-0.03
- **GPT-4**: 토큰당 약 $0.03/1K tokens
- **예상 월 비용**: 사용량에 따라 $10-100 정도

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. 모든 의존성이 올바르게 설치되었는지
2. 환경 변수 파일이 올바른 위치에 있는지
3. API 키가 유효한지
4. 포트가 사용 가능한지

추가 도움이 필요하면 이슈를 생성해주세요.
