'use client'

import React from 'react'
import Card from '@/components/ui/Card'

interface SentimentAnalysisProps {
  sentiment: {
    score: number
    status: string
  }
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentiment }) => {
  const { score, status } = sentiment

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400'
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getSentimentIcon = (score: number) => {
    if (score >= 70) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    } else if (score >= 40) {
      return (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    } else {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
        </svg>
      )
    }
  }

  return (
    <Card className="h-full">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          시장 감성 분석
        </h3>
        
        <div className="space-y-4">
          {/* 감성 점수 */}
          <div className="flex items-center justify-center space-x-3">
            {getSentimentIcon(score)}
            <div>
              <p className="text-2xl font-bold" style={{ color: getSentimentColor(score) }}>
                {score}/100
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                감성 점수
              </p>
            </div>
          </div>

          {/* 감성 상태 */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              현재 상태
            </p>
            <p className={`text-lg font-semibold ${getSentimentColor(score)}`}>
              {status}
            </p>
          </div>

          {/* 감성 바 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>부정적</span>
              <span>중립</span>
              <span>긍정적</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${score}%`,
                  backgroundColor: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-xs text-purple-800 dark:text-purple-200">
            📊 뉴스, 소셜미디어, 시장 반응을 종합 분석한 감성 지수입니다.
          </p>
        </div>
      </div>
    </Card>
  )
}

export default SentimentAnalysis 