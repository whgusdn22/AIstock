'use client'

import React from 'react'
import Card from '@/components/ui/Card'

interface OverallScoreProps {
  overall_score: {
    score: number
    grade: string
    confidence: string
    breakdown: {
      chart_score: number
      sentiment_score: number
      pattern_score: number
    }
  }
}

const OverallScore: React.FC<OverallScoreProps> = ({ overall_score }) => {
  const { score, grade, confidence, breakdown } = overall_score

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    } else if (score >= 60) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    } else if (score >= 40) {
      return (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    } else {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  return (
    <Card className="h-full">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          종합 평가
        </h3>
        
        <div className="space-y-4">
          {/* 종합 점수 */}
          <div className="flex items-center justify-center space-x-3">
            {getScoreIcon(score)}
            <div>
              <p className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}/100
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                종합 점수
              </p>
            </div>
          </div>

          {/* 등급 및 신뢰도 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">등급</p>
              <p className={`font-semibold ${getScoreColor(score)}`}>
                {grade}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">신뢰도</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {confidence}
              </p>
            </div>
          </div>

          {/* 점수 분해 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              세부 점수
            </p>
            
            {/* 차트 분석 점수 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">차트 분석</span>
                <span className="font-medium">{breakdown.chart_score}점</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.chart_score}%` }}
                ></div>
              </div>
            </div>

            {/* 감성 분석 점수 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">감성 분석</span>
                <span className="font-medium">{breakdown.sentiment_score}점</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.sentiment_score}%` }}
                ></div>
              </div>
            </div>

            {/* 패턴 분석 점수 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">패턴 분석</span>
                <span className="font-medium">{breakdown.pattern_score}점</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.pattern_score}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 가중치 정보 */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 가중치: 차트 분석 40% | 감성 분석 30% | 패턴 분석 30%
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          * 종합 점수는 AI 분석 결과를 종합하여 계산됩니다.
        </div>
      </div>
    </Card>
  )
}

export default OverallScore 