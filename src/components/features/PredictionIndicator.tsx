'use client'

import React from 'react'
import Card from '@/components/ui/Card'

interface PredictionIndicatorProps {
  prediction: {
    up_probability: number
    down_probability: number
  }
}

const PredictionIndicator: React.FC<PredictionIndicatorProps> = ({ prediction }) => {
  const { up_probability, down_probability } = prediction

  return (
    <Card className="h-full">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          가격 변동 예측
        </h3>
        
        <div className="space-y-4">
          {/* 상승 확률 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                상승 확률
              </span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {up_probability}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${up_probability}%` }}
              ></div>
            </div>
          </div>

          {/* 하락 확률 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                하락 확률
              </span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {down_probability}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${down_probability}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 종합 판단 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            AI 종합 판단
          </p>
          <p className={`text-lg font-semibold ${
            up_probability > down_probability 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {up_probability > down_probability ? '상승 우세' : '하락 우세'}
          </p>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          * 이는 참고용 확률이며, 실제 투자 결과와 다를 수 있습니다.
        </div>
      </div>
    </Card>
  )
}

export default PredictionIndicator 