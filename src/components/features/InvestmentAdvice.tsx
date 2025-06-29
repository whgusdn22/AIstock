'use client'

import React from 'react'
import Card from '@/components/ui/Card'

interface InvestmentAdviceProps {
  advice: {
    recommendation: string
    confidence: string
    target_price: string
    stop_loss: string
    time_horizon: string
    risk_assessment: string
    key_reasons: string[]
    cautions: string[]
    strategy: string
  }
}

const InvestmentAdvice: React.FC<InvestmentAdviceProps> = ({ advice }) => {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case '매수':
        return 'text-green-600 dark:text-green-400'
      case '매도':
        return 'text-red-600 dark:text-red-400'
      case '관망':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case '매수':
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case '매도':
        return (
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        )
      case '관망':
        return (
          <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  return (
    <Card className="h-full">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          AI 투자 조언
        </h3>
        
        <div className="space-y-4">
          {/* 투자 추천 */}
          <div className="flex items-center justify-center space-x-3">
            {getRecommendationIcon(advice.recommendation)}
            <div>
              <p className={`text-2xl font-bold ${getRecommendationColor(advice.recommendation)}`}>
                {advice.recommendation}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                신뢰도: {advice.confidence}
              </p>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">목표가</p>
              <p className="font-semibold text-blue-800 dark:text-blue-200">
                {advice.target_price}
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">손절가</p>
              <p className="font-semibold text-red-800 dark:text-red-200">
                {advice.stop_loss}
              </p>
            </div>
          </div>

          {/* 투자 기간 및 리스크 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">투자 기간</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {advice.time_horizon}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">리스크</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {advice.risk_assessment}
              </p>
            </div>
          </div>

          {/* 주요 근거 */}
          {advice.key_reasons && advice.key_reasons.length > 0 && (
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                주요 근거
              </p>
              <ul className="space-y-1">
                {advice.key_reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 주의사항 */}
          {advice.cautions && advice.cautions.length > 0 && (
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                주의사항
              </p>
              <ul className="space-y-1">
                {advice.cautions.map((caution, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    {caution}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 투자 전략 */}
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
              투자 전략
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {advice.strategy}
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          * 이 조언은 참고용이며, 최종 투자 결정은 본인의 판단에 따라 신중하게 이루어져야 합니다.
        </div>
      </div>
    </Card>
  )
}

export default InvestmentAdvice 