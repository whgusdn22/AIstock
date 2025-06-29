#!/usr/bin/env python3
"""
AI 주식 차트 분석기 백엔드 설정 스크립트
"""

import os
import sys
from pathlib import Path

def create_env_file():
    """환경 변수 파일 생성"""
    env_file = Path(".env")
    
    if env_file.exists():
        print("⚠️  .env 파일이 이미 존재합니다.")
        overwrite = input("덮어쓰시겠습니까? (y/N): ").lower()
        if overwrite != 'y':
            print("설정을 취소했습니다.")
            return
    
    print("🔧 OpenAI API 키를 설정합니다...")
    api_key = input("OpenAI API 키를 입력하세요: ").strip()
    
    if not api_key:
        print("❌ API 키가 입력되지 않았습니다.")
        return
    
    # 환경 변수 내용 생성
    env_content = f"""# OpenAI API 설정
OPENAI_API_KEY={api_key}

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
"""
    
    # .env 파일 생성
    with open(env_file, 'w', encoding='utf-8') as f:
        f.write(env_content)
    
    print("✅ .env 파일이 생성되었습니다!")
    print(f"📁 파일 위치: {env_file.absolute()}")

def check_dependencies():
    """의존성 확인"""
    print("📦 Python 패키지 의존성을 확인합니다...")
    
    try:
        import fastapi
        import openai
        import uvicorn
        import pillow
        import numpy
        print("✅ 모든 의존성이 설치되어 있습니다.")
    except ImportError as e:
        print(f"❌ 누락된 의존성: {e}")
        print("다음 명령어로 설치하세요:")
        print("pip install -r requirements.txt")
        return False
    
    return True

def main():
    """메인 함수"""
    print("🚀 AI 주식 차트 분석기 백엔드 설정")
    print("=" * 50)
    
    # 1. 의존성 확인
    if not check_dependencies():
        return
    
    # 2. 환경 변수 파일 생성
    create_env_file()
    
    print("\n🎉 설정이 완료되었습니다!")
    print("\n다음 명령어로 서버를 실행하세요:")
    print("python main.py")
    
    print("\n📋 추가 정보:")
    print("- OpenAI API 키는 https://platform.openai.com/api-keys 에서 발급받을 수 있습니다.")
    print("- API 사용량에 따른 비용이 발생할 수 있습니다.")
    print("- .env 파일은 절대 Git에 커밋하지 마세요!")

if __name__ == "__main__":
    main() 