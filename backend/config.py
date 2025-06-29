import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class Config:
    # OpenAI API 설정
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # 서버 설정
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    # 로깅 설정
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # CORS 설정
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    
    # 분석 설정
    MAX_IMAGE_SIZE = int(os.getenv("MAX_IMAGE_SIZE", 10485760))  # 10MB
    SUPPORTED_FORMATS = os.getenv("SUPPORTED_FORMATS", "jpg,jpeg,png,gif").split(",")
    
    # OpenAI 모델 설정
    GPT4_VISION_MODEL = "gpt-4o"  # 최신 GPT-4o 모델 (Vision 지원)
    GPT4_MODEL = "gpt-4o"
    
    @classmethod
    def validate(cls):
        """필수 설정 검증"""
        if not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY가 설정되지 않았습니다.")
        
        return True 