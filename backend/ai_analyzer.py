import base64
import io
import json
import re
from typing import Dict, List, Any, Tuple
from PIL import Image
import openai
from loguru import logger
from config import Config

class AIAnalyzer:
    def __init__(self):
        """AI 분석기 초기화"""
        # OpenAI 클라이언트 초기화 (최신 방식)
        self.client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)
        
    def analyze_chart_image(self, image: Image.Image) -> Dict[str, Any]:
        """
        차트 이미지를 GPT-4 Vision으로 분석
        """
        try:
            # 이미지를 RGB로 변환 (RGBA 문제 해결)
            if image.mode == 'RGBA':
                # 흰색 배경으로 변환
                rgb_image = Image.new('RGB', image.size, (255, 255, 255))
                rgb_image.paste(image, mask=image.split()[-1])
                image = rgb_image
            elif image.mode != 'RGB':
                image = image.convert('RGB')
            
            # 이미지를 base64로 인코딩
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG", quality=85)
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            logger.info(f"이미지 크기: {image.size}, 형식: {image.format}")
            logger.info(f"OpenAI API 키 확인: {Config.OPENAI_API_KEY[:10]}...")
            
            # GPT-4 Vision 프롬프트
            prompt = """
            주식 차트 전문가로서 이 차트를 분석해주세요.

            반드시 다음 JSON 형식으로만 답변해주세요. 다른 설명이나 텍스트는 포함하지 마세요:

            {
                "trend": "상승",
                "patterns": ["상승 추세", "지지선 돌파"],
                "support_level": "지지선 가격",
                "resistance_level": "저항선 가격",
                "prediction": {
                    "up_probability": 70,
                    "down_probability": 30,
                    "confidence": "높음"
                },
                "technical_indicators": {
                    "rsi": "중립",
                    "macd": "상승신호",
                    "moving_averages": "골든크로스"
                },
                "risk_level": "보통",
                "summary": "상승 추세가 확인되며 매수 신호"
            }

            규칙:
            1. JSON 형식만 사용하세요
            2. up_probability와 down_probability는 0-100 정수
            3. 두 확률의 합은 100이어야 함
            4. 차트를 실제로 분석해서 구체적인 확률을 제공하세요
            5. 50:50은 금지합니다
            """
            
            logger.info("GPT-4 Vision API 호출 시작...")
            
            try:
                logger.info("GPT-4 Vision API 호출 중...")
                response = self.client.chat.completions.create(
                    model=Config.GPT4_VISION_MODEL,
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt},
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{img_str}"
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens=2000,
                    temperature=0.3
                )
                
                logger.info("GPT-4 Vision API 호출 성공!")
                
                # 응답 파싱
                content = response.choices[0].message.content
                logger.info(f"GPT 응답 원본 (길이: {len(content)}): {content}")
                
                analysis_result = self._parse_chart_analysis(content)
                
                logger.info(f"차트 분석 완료: {analysis_result}")
                return analysis_result
                
            except Exception as api_error:
                logger.error(f"GPT-4 Vision API 호출 실패: {str(api_error)}")
                logger.error(f"API 오류 타입: {type(api_error).__name__}")
                logger.error(f"API 오류 상세: {repr(api_error)}")
                return self._get_default_chart_analysis()
            
        except Exception as e:
            logger.error(f"차트 분석 중 오류: {str(e)}")
            return self._get_default_chart_analysis()
    
    def analyze_sentiment_from_chart(self, chart_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        차트 분석 결과를 기반으로 정교한 감성 분석 생성
        """
        try:
            logger.info(f"차트 분석 결과: {chart_analysis}")
            
            prediction = chart_analysis.get("prediction", {})
            up_prob = prediction.get("up_probability", 50)
            down_prob = prediction.get("down_probability", 50)
            confidence = prediction.get("confidence", "보통")
            
            trend = chart_analysis.get("trend", "횡보")
            patterns = chart_analysis.get("patterns", [])
            technical_indicators = chart_analysis.get("technical_indicators", {})
            risk_level = chart_analysis.get("risk_level", "보통")
            
            logger.info(f"기본 확률 - 상승: {up_prob}, 하락: {down_prob}")
            
            # 감성 점수 계산 (여러 요소 종합)
            base_score = up_prob
            
            # 패턴 점수 조정
            pattern_bonus = 0
            positive_patterns = ["상승", "돌파", "반등", "골든크로스", "지지"]
            negative_patterns = ["하락", "저항", "데드크로스", "헤드앤숄더"]
            
            for pattern in patterns:
                if any(pos in pattern for pos in positive_patterns):
                    pattern_bonus += 5
                    logger.info(f"긍정적 패턴 발견: {pattern} (+5)")
                elif any(neg in pattern for neg in negative_patterns):
                    pattern_bonus -= 5
                    logger.info(f"부정적 패턴 발견: {pattern} (-5)")
            
            # 기술적 지표 점수 조정
            indicator_bonus = 0
            rsi = technical_indicators.get("rsi", "")
            macd = technical_indicators.get("macd", "")
            
            if "과매도" in rsi:
                indicator_bonus += 10  # 반등 가능성
                logger.info("RSI 과매도 감지 (+10)")
            elif "과매수" in rsi:
                indicator_bonus -= 10  # 조정 가능성
                logger.info("RSI 과매수 감지 (-10)")
                
            if "상승신호" in macd:
                indicator_bonus += 5
                logger.info("MACD 상승신호 (+5)")
            elif "하락신호" in macd:
                indicator_bonus -= 5
                logger.info("MACD 하락신호 (-5)")
            
            # 최종 감성 점수 계산
            final_score = max(0, min(100, base_score + pattern_bonus + indicator_bonus))
            
            logger.info(f"감성 점수 계산: 기본({base_score}) + 패턴({pattern_bonus}) + 지표({indicator_bonus}) = {final_score}")
            
            # 감성 상태 결정
            if final_score >= 75:
                status = "매우 긍정적"
            elif final_score >= 60:
                status = "긍정적"
            elif final_score >= 40:
                status = "중립적"
            elif final_score >= 25:
                status = "부정적"
            else:
                status = "매우 부정적"
            
            # 주요 요인 구성
            key_factors = []
            if trend != "횡보":
                key_factors.append(f"{trend} 추세")
            key_factors.extend(patterns[:3])
            
            if confidence == "높음":
                key_factors.append("높은 신뢰도")
            elif confidence == "낮음":
                key_factors.append("낮은 신뢰도")
            
            result = {
                "score": round(final_score, 1),
                "status": status,
                "key_factors": key_factors,
                "market_sentiment": f"{trend} 추세 ({confidence} 신뢰도)",
                "news_sentiment": "차트 패턴 기반",
                "social_sentiment": "기술적 지표 기반"
            }
            
            logger.info(f"최종 감성 분석 결과: {result}")
            return result
            
        except Exception as e:
            logger.error(f"차트 기반 감성 분석 중 오류: {str(e)}")
            return self._get_default_sentiment_analysis()

    def generate_investment_advice(self, chart_analysis: Dict, sentiment_analysis: Dict = None) -> Dict[str, Any]:
        """
        종합 투자 조언 생성
        """
        try:
            # 감성 분석이 없으면 차트 분석만으로 조언 생성
            if sentiment_analysis is None:
                sentiment_analysis = self._get_default_sentiment_analysis()
            
            logger.info("투자 조언 생성 시작...")
            logger.info(f"OpenAI API 키 확인: {Config.OPENAI_API_KEY[:10]}...")
            
            prompt = f"""
            다음 분석 결과를 종합하여 투자 조언을 생성해주세요:

            차트 분석: {json.dumps(chart_analysis, ensure_ascii=False)}
            감성 분석: {json.dumps(sentiment_analysis, ensure_ascii=False)}

            다음 JSON 형식으로 답변해주세요:

            {{
                "recommendation": "투자 추천 (매수/매도/관망)",
                "confidence": "신뢰도 (높음/보통/낮음)",
                "target_price": "목표가",
                "stop_loss": "손절가",
                "time_horizon": "투자 기간 (단기/중기/장기)",
                "risk_assessment": "리스크 평가",
                "key_reasons": ["주요 근거들"],
                "cautions": ["주의사항들"],
                "strategy": "투자 전략"
            }}

            현실적이고 실용적인 조언을 제공해주세요.
            """
            
            try:
                response = self.client.chat.completions.create(
                    model=Config.GPT4_MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=1500,
                    temperature=0.3
                )
                
                content = response.choices[0].message.content
                advice_result = self._parse_investment_advice(content)
                
                logger.info(f"투자 조언 생성 완료: {advice_result}")
                return advice_result
                
            except Exception as api_error:
                logger.error(f"투자 조언 API 호출 실패: {str(api_error)}")
                logger.error(f"API 오류 타입: {type(api_error).__name__}")
                return self._get_default_investment_advice()
            
        except Exception as e:
            logger.error(f"투자 조언 생성 중 오류: {str(e)}")
            return self._get_default_investment_advice()
    
    def _parse_chart_analysis(self, content: str) -> Dict[str, Any]:
        """차트 분석 결과 파싱"""
        try:
            logger.info(f"=== JSON 파싱 시작 ===")
            logger.info(f"GPT 응답 원본: {content}")
            
            # JSON 추출 (더 정교한 방법)
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                logger.info(f"추출된 JSON: {json_str}")
                
                # JSON 파싱
                result = json.loads(json_str)
                logger.info(f"파싱 성공! 결과: {result}")
                
                # 필수 필드 검증 및 기본값 설정
                if "prediction" not in result:
                    logger.warning("prediction 필드가 없어 기본값 추가")
                    result["prediction"] = {}
                
                prediction = result["prediction"]
                if "up_probability" not in prediction or "down_probability" not in prediction:
                    logger.warning("확률 정보가 없어 기본값 사용")
                    prediction["up_probability"] = 50
                    prediction["down_probability"] = 50
                
                # 확률이 문자열인 경우 숫자로 변환
                if isinstance(prediction["up_probability"], str):
                    try:
                        prediction["up_probability"] = int(prediction["up_probability"])
                        logger.info(f"up_probability 문자열을 숫자로 변환: {prediction['up_probability']}")
                    except:
                        logger.warning("up_probability 변환 실패, 기본값 사용")
                        prediction["up_probability"] = 50
                
                if isinstance(prediction["down_probability"], str):
                    try:
                        prediction["down_probability"] = int(prediction["down_probability"])
                        logger.info(f"down_probability 문자열을 숫자로 변환: {prediction['down_probability']}")
                    except:
                        logger.warning("down_probability 변환 실패, 기본값 사용")
                        prediction["down_probability"] = 50
                
                logger.info(f"=== 최종 파싱 결과 ===")
                logger.info(f"상승 확률: {prediction['up_probability']}")
                logger.info(f"하락 확률: {prediction['down_probability']}")
                logger.info(f"전체 결과: {result}")
                return result
            else:
                logger.error("JSON을 찾을 수 없음")
                logger.error(f"전체 응답에서 JSON 패턴을 찾지 못함: {content}")
                
        except json.JSONDecodeError as e:
            logger.error(f"JSON 파싱 오류: {str(e)}")
            logger.error(f"파싱 시도한 문자열: {json_str if 'json_str' in locals() else 'N/A'}")
        except Exception as e:
            logger.error(f"파싱 중 예상치 못한 오류: {str(e)}")
        
        # 파싱 실패 시 기본값 반환
        logger.warning("=== 기본 차트 분석 결과 사용 ===")
        return self._get_default_chart_analysis()
    
    def _parse_investment_advice(self, content: str) -> Dict[str, Any]:
        """투자 조언 파싱"""
        try:
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        return self._get_default_investment_advice()
    
    def _get_default_chart_analysis(self) -> Dict[str, Any]:
        """기본 차트 분석 결과"""
        return {
            "trend": "횡보",
            "patterns": ["패턴 감지 실패"],
            "support_level": "N/A",
            "resistance_level": "N/A",
            "prediction": {
                "up_probability": 50,
                "down_probability": 50,
                "confidence": "낮음"
            },
            "technical_indicators": {
                "rsi": "N/A",
                "macd": "N/A",
                "moving_averages": "N/A"
            },
            "risk_level": "보통",
            "summary": "분석에 실패했습니다."
        }
    
    def _get_default_sentiment_analysis(self) -> Dict[str, Any]:
        """기본 감성 분석 결과"""
        return {
            "score": 50,
            "status": "중립적",
            "key_factors": ["차트 분석 기반"],
            "market_sentiment": "N/A",
            "news_sentiment": "N/A",
            "social_sentiment": "N/A"
        }
    
    def _get_default_investment_advice(self) -> Dict[str, Any]:
        """기본 투자 조언"""
        return {
            "recommendation": "관망",
            "confidence": "낮음",
            "target_price": "N/A",
            "stop_loss": "N/A",
            "time_horizon": "단기",
            "risk_assessment": "높음",
            "key_reasons": ["분석 실패로 인한 불확실성"],
            "cautions": ["신중한 투자 결정 필요"],
            "strategy": "추가 분석 후 투자 결정"
        }

    def _validate_and_correct_probabilities(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """확률 검증 및 보정"""
        try:
            prediction = analysis_result.get("prediction", {})
            up_prob = prediction.get("up_probability", 50)
            down_prob = prediction.get("down_probability", 50)
            
            # 확률이 숫자가 아니거나 범위를 벗어난 경우 보정
            if not isinstance(up_prob, (int, float)) or up_prob < 0 or up_prob > 100:
                up_prob = 50
            if not isinstance(down_prob, (int, float)) or down_prob < 0 or down_prob > 100:
                down_prob = 50
            
            # 합이 100이 되도록 정규화
            total = up_prob + down_prob
            if total != 0:
                up_prob = round((up_prob / total) * 100)
                down_prob = 100 - up_prob
            else:
                up_prob = 50
                down_prob = 50
            
            analysis_result["prediction"]["up_probability"] = up_prob
            analysis_result["prediction"]["down_probability"] = down_prob
            
            return analysis_result
        except Exception as e:
            logger.error(f"확률 보정 중 오류: {str(e)}")
            return analysis_result 