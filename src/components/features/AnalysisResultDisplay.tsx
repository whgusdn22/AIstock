'use client'

import React from 'react'
import { useAnalysisStore } from '@/lib/store'
import PredictionIndicator from './PredictionIndicator'
import TechnicalPatternInfo from './TechnicalPatternInfo'
import SentimentAnalysis from './SentimentAnalysis'
import InvestmentAdvice from './InvestmentAdvice'
import OverallScore from './OverallScore'

const AnalysisResultDisplay = () => {
  const { isAnalyzing, result, error } = useAnalysisStore()

  if (isAnalyzing) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          AI가 차트를 분석하고 있습니다...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          GPT-4 Vision과 GPT-4를 사용하여 종합 분석을 수행합니다
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">분석 오류</h3>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          AI 분석 결과
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          차트 이미지를 업로드하면 GPT-4 Vision과 GPT-4를 활용한 종합 분석 결과가 표시됩니다
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        AI 종합 분석 결과
      </h2>
      
      {/* 종합 점수 (새로 추가) */}
      {result.overall_score && (
        <div className="max-w-2xl mx-auto mb-8">
          <OverallScore overall_score={result.overall_score} />
        </div>
      )}
      
      {/* 기존 분석 결과들 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PredictionIndicator prediction={result.prediction} />
        <TechnicalPatternInfo patterns={result.technical_patterns} />
        <SentimentAnalysis sentiment={result.sentiment} />
      </div>
      
      {/* 투자 조언 (새로 추가) */}
      {result.investment_advice && (
        <div className="max-w-4xl mx-auto">
          <InvestmentAdvice advice={result.investment_advice} />
        </div>
      )}
      
      {/* 상세 분석 정보 */}
      {result.chart_analysis && (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 차트 분석 상세 */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                차트 분석 상세
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">추세:</span>
                  <span className="ml-2 font-medium">{result.chart_analysis.trend}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">지지선:</span>
                  <span className="ml-2 font-medium">{result.chart_analysis.support_level}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">저항선:</span>
                  <span className="ml-2 font-medium">{result.chart_analysis.resistance_level}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">신뢰도:</span>
                  <span className="ml-2 font-medium">{result.chart_analysis.prediction.confidence}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">리스크:</span>
                  <span className="ml-2 font-medium">{result.chart_analysis.risk_level}</span>
                </div>
              </div>
            </div>
            
            {/* 감성 분석 상세 */}
            {result.sentiment_analysis && (
              <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  감성 분석 상세
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">시장 감성:</span>
                    <span className="ml-2 font-medium">{result.sentiment_analysis.market_sentiment}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">뉴스 감성:</span>
                    <span className="ml-2 font-medium">{result.sentiment_analysis.news_sentiment}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">소셜 감성:</span>
                    <span className="ml-2 font-medium">{result.sentiment_analysis.social_sentiment}</span>
                  </div>
                  {result.sentiment_analysis.key_factors && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">주요 요인:</span>
                      <ul className="mt-1 ml-4 text-sm">
                        {result.sentiment_analysis.key_factors.map((factor, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 분석 시간 정보 */}
      {result.analysis_timestamp && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          분석 시간: {new Date(result.analysis_timestamp).toLocaleString('ko-KR')}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
          ⚠️ 이 분석 결과는 GPT-4 Vision과 GPT-4를 활용한 참고용이며, 투자 결정은 본인의 판단에 따라 신중하게 이루어져야 합니다.
        </p>
      </div>
    </div>
  )
}

export default AnalysisResultDisplay 