# AI 주식 차트 분석기

OpenAI GPT-4o(Vision)와 FastAPI, Next.js를 활용하여 주식 차트 이미지를 분석하고 투자 조언을 제공하는 웹사이트입니다.

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
- **Pillow, OpenCV** (이미지 처리)

## 📦 배포 및 운영

### Railway (백엔드)

- `https://aistock-production.up.railway.app` (예시)
- 환경 변수는 Railway 대시보드에서 설정
- **비용 절감**: 사용하지 않을 때는 Railway에서 "Stop" 버튼으로 서버를 중지 가능

### Vercel (프론트엔드)

- GitHub 연동 후 자동 배포
- 환경 변수는 Vercel 대시보드에서 설정
- `BACKEND_URL`에 Railway 백엔드 주소 입력

### 환경 변수 예시

#### backend/.env (로컬 개발)

```
OPENAI_API_KEY=sk-xxxxxx
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

#### vercel 환경 변수

```
BACKEND_URL=https://aistock-production.up.railway.app
NEXT_PUBLIC_APP_NAME=AI 주식 차트 분석기
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## ⚡️ 운영/비용 관리

- Railway는 서버가 켜져 있을 때만 과금됨. 필요할 때만 "Start", 사용 후 "Stop" 추천
- Vercel은 무료 플랜에서는 트래픽 없으면 슬립 상태
- OpenAI Vision API는 사용량에 따라 과금되므로 주의

## 🛡️ 장애/오류 대응

- 50점만 나오는 경우: OpenAI Vision API 거부(권한/쿼터/프롬프트 문제) 또는 환경 변수 미설정
- 500 에러: 백엔드에서 OpenAI API 호출 실패, 환경 변수 또는 프롬프트 점검
- 프론트-백엔드 연결 문제: Vercel의 BACKEND_URL, Railway의 ALLOWED_ORIGINS 환경 변수 확인

## 📝 개발/운영 팁

- 프롬프트는 단순하고 명확하게 작성 (예: "상승/하락/횡보 중 하나로만 판단해서 JSON으로 답변하세요.")
- OpenAI Vision 권한/쿼터/비용 항상 체크
- 배포 후 환경 변수 변경 시 반드시 재배포
- Railway/Vercel 모두 환경 변수는 대시보드에서 관리

## 📋 사용법

1. **차트 이미지 업로드**: 메인 페이지에서 주식 차트 이미지를 드래그 앤 드롭하거나 파일 선택
2. **AI 분석 대기**: GPT-4o Vision이 차트를 분석
3. **결과 확인**: 종합 점수, 예측, 패턴, 감성, 투자 조언 등 확인

## ⚠️ 주의사항

- 이 서비스는 참고용이며, 투자 결정은 본인의 판단에 따라 신중하게 이루어져야 합니다
- OpenAI API 사용량에 따른 비용이 발생할 수 있습니다
- AI 분석 결과는 100% 정확하지 않을 수 있습니다
- 실제 투자 손실에 대한 책임은 사용자에게 있습니다

## 🤝 기여 및 문의

- Pull Request, Issue 환영
- 궁금한 점은 GitHub Issue로 남겨주세요

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

백엔드 서버가 `http://localhost:8000`에서 실행됩니다.

### 3. 프론트엔드 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

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

## 🔮 향후 계획

- [ ] 실시간 주가 데이터 연동
- [ ] 사용자 인증 시스템
- [ ] 분석 히스토리 저장
- [ ] 포트폴리오 관리 기능
- [ ] 모바일 앱 개발
- [ ] 다국어 지원
- [ ] 고급 차트 라이브러리 연동

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
