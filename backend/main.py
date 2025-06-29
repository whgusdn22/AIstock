from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from PIL import Image
import io
from datetime import datetime
from typing import Dict, Any
from loguru import logger
import os

from config import Config
from ai_analyzer import AIAnalyzer

# 설정 검증
Config.validate()

# FastAPI 앱 초기화
app = FastAPI(
    title="AI 주식 차트 분석기 API",
    description="OpenAI GPT-4를 활용한 차트 이미지 분석 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI 분석기 초기화
ai_analyzer = AIAnalyzer()

@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "AI 주식 차트 분석기 API가 실행 중입니다.",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze")
async def analyze_chart(file: UploadFile = File(...)):
    """
    차트 이미지를 분석하여 투자 정보를 반환합니다.
    """
    try:
        logger.info(f"분석 요청 받음: {file.filename}")
        
        # 파일 검증
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400, 
                detail="이미지 파일만 업로드 가능합니다."
            )
        
        if file.size > Config.MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"파일 크기가 너무 큽니다. 최대 {Config.MAX_IMAGE_SIZE // 1024 // 1024}MB까지 가능합니다."
            )
        
        # 이미지 읽기
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # 이미지 형식 검증
        if image.format.lower() not in [fmt.lower() for fmt in Config.SUPPORTED_FORMATS]:
            raise HTTPException(
                status_code=400,
                detail=f"지원하지 않는 이미지 형식입니다. 지원 형식: {', '.join(Config.SUPPORTED_FORMATS)}"
            )
        
        logger.info(f"이미지 로드 완료: {image.format} {image.size}")
        
        # 1. 차트 이미지 분석 (GPT-4 Vision)
        logger.info("차트 이미지 분석 시작...")
        chart_analysis = ai_analyzer.analyze_chart_image(image)
        
        # 2. 차트 분석 결과를 기반으로 감성 분석 생성
        logger.info("차트 기반 감성 분석 시작...")
        sentiment_analysis = ai_analyzer.analyze_sentiment_from_chart(chart_analysis)
        
        # 3. 종합 투자 조언 생성 (GPT-4)
        logger.info("투자 조언 생성 시작...")
        investment_advice = ai_analyzer.generate_investment_advice(
            chart_analysis, 
            sentiment_analysis
        )
        
        # 4. 종합 점수 계산
        overall_score = calculate_overall_score(chart_analysis, sentiment_analysis)
        
        # 5. 결과 조합
        result = {
            "prediction": {
                "up_probability": chart_analysis.get("prediction", {}).get("up_probability", 50),
                "down_probability": chart_analysis.get("prediction", {}).get("down_probability", 50)
            },
            "technical_patterns": chart_analysis.get("patterns", []),
            "sentiment": {
                "score": sentiment_analysis.get("score", 50),
                "status": sentiment_analysis.get("status", "중립적")
            },
            "chart_analysis": chart_analysis,
            "sentiment_analysis": sentiment_analysis,
            "investment_advice": investment_advice,
            "overall_score": overall_score,
            "analysis_timestamp": datetime.now().isoformat(),
            "image_metadata": {
                "filename": file.filename,
                "size": len(image_data),
                "format": image.format,
                "dimensions": image.size
            }
        }
        
        logger.info(f"분석 완료: {result}")
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"분석 중 오류 발생: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"분석 중 오류가 발생했습니다: {str(e)}"
        )

def calculate_overall_score(chart_analysis: Dict, sentiment_analysis: Dict) -> Dict[str, Any]:
    """
    모든 분석 결과를 종합하여 전체 점수를 계산합니다.
    """
    # 차트 분석 점수
    chart_prediction = chart_analysis.get("prediction", {})
    chart_score = chart_prediction.get("up_probability", 50)
    
    # 감성 점수
    sentiment_score = sentiment_analysis.get("score", 50)
    
    # 패턴 점수 (패턴 개수와 유형에 따라)
    patterns = chart_analysis.get("patterns", [])
    pattern_score = calculate_pattern_score(patterns)
    
    # 가중 평균 계산
    overall_score = (
        chart_score * 0.4 +      # 차트 분석 40%
        sentiment_score * 0.3 +  # 감성 분석 30%
        pattern_score * 0.3      # 패턴 분석 30%
    )
    
    # 등급 결정
    if overall_score >= 80:
        grade = "매우 좋음"
        confidence = "높음"
    elif overall_score >= 60:
        grade = "좋음"
        confidence = "보통"
    elif overall_score >= 40:
        grade = "보통"
        confidence = "낮음"
    else:
        grade = "나쁨"
        confidence = "매우 낮음"
    
    return {
        "score": round(overall_score, 1),
        "grade": grade,
        "confidence": confidence,
        "breakdown": {
            "chart_score": chart_score,
            "sentiment_score": sentiment_score,
            "pattern_score": pattern_score
        }
    }

def calculate_pattern_score(patterns: list) -> float:
    """
    기술적 패턴을 분석하여 점수를 계산합니다.
    """
    if not patterns:
        return 50.0
    
    # 긍정적 패턴들
    positive_patterns = [
        "골든 크로스", "상승 추세", "지지선", "돌파", "반등", 
        "상승 삼각형", "이중 바닥", "컵과 손잡이"
    ]
    
    # 부정적 패턴들
    negative_patterns = [
        "데드 크로스", "하락 추세", "저항선", "하락 삼각형", 
        "헤드앤숄더", "이중 천정", "깃발 패턴"
    ]
    
    score = 50.0  # 기본 점수
    
    for pattern in patterns:
        pattern_lower = pattern.lower()
        
        # 긍정적 패턴 체크
        for pos_pattern in positive_patterns:
            if pos_pattern.lower() in pattern_lower:
                score += 10
                break
        
        # 부정적 패턴 체크
        for neg_pattern in negative_patterns:
            if neg_pattern.lower() in pattern_lower:
                score -= 10
                break
    
    # 점수 범위 제한 (0-100)
    return max(0, min(100, score))

@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "openai_configured": bool(Config.OPENAI_API_KEY)
    }

@app.get("/config")
async def get_config():
    """설정 정보 조회 (민감한 정보 제외)"""
    return {
        "max_image_size": Config.MAX_IMAGE_SIZE,
        "supported_formats": Config.SUPPORTED_FORMATS,
        "allowed_origins": Config.ALLOWED_ORIGINS,
        "openai_configured": bool(Config.OPENAI_API_KEY)
    }

if __name__ == "__main__":
    logger.info("AI 주식 차트 분석기 서버 시작...")
    
    # 환경 변수에서 포트 가져오기 (Railway 호환)
    try:
        port = int(os.getenv("PORT", Config.PORT))
        logger.info(f"서버 포트: {port}")
    except (ValueError, TypeError):
        port = Config.PORT
        logger.warning(f"포트 환경 변수 파싱 실패, 기본값 사용: {port}")
    
    uvicorn.run(
        app, 
        host=Config.HOST, 
        port=port,
        log_level=Config.LOG_LEVEL.lower()
    ) 