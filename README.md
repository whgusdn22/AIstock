# AI 주식 차트 분석기

OpenAI GPT-4o(Vision)를 활용하여 주식 차트 이미지를 분석하고 투자 조언을 제공하는 웹사이트입니다. (배포X)

## 🚀 주요 기능

- **차트 이미지 업로드**: 드래그 앤 드롭 또는 파일 선택으로 차트 이미지 업로드
- **GPT-4o Vision 차트 분석**: 업로드된 차트 이미지를 AI가 실시간으로 분석
- **감성 분석**: 차트 기반 감성 분석
- **종합 투자 조언**: AI가 생성한 매수/매도/관망 추천
- **종합 점수**: 차트, 감성, 패턴 분석을 종합한 점수
- **실시간 분석**: 실제 AI 모델을 사용한 동적 분석

## 🛠️ 기술 스택

### 프론트엔드

- **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Zustand**

### 백엔드

- **FastAPI (Python)**, **OpenAI GPT-4o Vision API**
- **Pillow, OpenCV**

## 📋 사용법

1. **차트 이미지 업로드**: 메인 페이지에서 주식 차트 이미지를 드래그 앤 드롭하거나 파일 선택
2. **AI 분석 대기**: GPT-4o Vision이 차트를 분석
3. **결과 확인**: 종합 점수, 예측, 패턴, 감성, 투자 조언 등 확인

## 📁 프로젝트 구조

```
AI_stock/
├── src/                          # Next.js 프론트엔드
│   ├── app/
│   │   ├── api/analyze/route.ts  # 프록시 API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                   # 기본 UI 컴포넌트
│   │   └── features/             # 핵심 기능 컴포넌트
│   │       ├── StockImageUploader.tsx
│   │       ├── AnalysisResultDisplay.tsx
│   │       ├── PredictionIndicator.tsx
│   │       ├── TechnicalPatternInfo.tsx
│   │       ├── SentimentAnalysis.tsx
│   │       ├── InvestmentAdvice.tsx      # 새로 추가
│   │       └── OverallScore.tsx          # 새로 추가
│   └── lib/
│       └── store.ts
├── backend/                      # Python 백엔드
│   ├── main.py                   # FastAPI 서버
│   ├── ai_analyzer.py            # OpenAI API 분석기
│   ├── config.py                 # 설정 관리
│   └── requirements.txt          # Python 의존성
├── package.json
└── README.md
```

## 🚀 시작하기

### 1. 환경 설정

#### OpenAI API 키 설정

```bash
# backend/.env 파일 생성
OPENAI_API_KEY=your_openai_api_key_here
```

#### 프론트엔드 설정

```bash
# .env.local 파일 생성
BACKEND_URL=http://localhost:8000
```

### 2. 백엔드 실행

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. 프론트엔드 실행

```bash
npm install
npm run dev
```

## 🤖 AI 분석 기능

### GPT-4 Vision 차트 분석

- **추세 분석**: 상승/하락/횡보 추세 판단
- **패턴 감지**: 골든 크로스, 데드 크로스, 삼각형 패턴 등
- **지지선/저항선**: 주요 가격 지지 및 저항 수준
- **기술적 지표**: RSI, MACD, 이동평균선 상태
- **리스크 평가**: 투자 리스크 수준

### GPT-4 감성 분석

- **시장 감성**: 전반적인 시장 분위기
- **뉴스 감성**: 관련 뉴스의 긍정/부정 분석
- **소셜미디어 감성**: 소셜미디어 반응 분석
- **주요 영향 요인**: 시장에 영향을 주는 주요 요인들

### 종합 투자 조언

- **투자 추천**: 매수/매도/관망 판단
- **목표가/손절가**: 구체적인 가격 목표
- **투자 기간**: 단기/중기/장기 추천
- **리스크 평가**: 투자 리스크 수준
- **투자 전략**: 구체적인 투자 전략 제안

## 📊 점수 계산 시스템

### 종합 점수 (100점 만점)

- **차트 분석**: 40% (GPT-4 Vision 분석 결과)
- **감성 분석**: 30% (GPT-4 감성 분석 결과)
- **패턴 분석**: 30% (기술적 패턴 분석)

### 등급 시스템

- **80점 이상**: 매우 좋음 (높은 신뢰도)
- **60-79점**: 좋음 (보통 신뢰도)
- **40-59점**: 보통 (낮은 신뢰도)
- **40점 미만**: 나쁨 (매우 낮은 신뢰도)

## 📄 라이선스

MIT License

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
