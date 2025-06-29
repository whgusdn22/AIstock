'use client'

import React from 'react'
import Card from '@/components/ui/Card'

interface TechnicalPatternInfoProps {
  patterns: string[]
}

const TechnicalPatternInfo: React.FC<TechnicalPatternInfoProps> = ({ patterns }) => {
  return (
    <Card className="h-full">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          기술적 패턴 분석
        </h3>
        
        {patterns.length > 0 ? (
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 text-left">
                    {pattern}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              발견된 기술적 패턴이 없습니다
            </p>
          </div>
        )}

        <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            💡 기술적 패턴은 과거 데이터를 기반으로 한 분석이며, 
            미래 가격 변동을 보장하지 않습니다.
          </p>
        </div>
      </div>
    </Card>
  )
}

export default TechnicalPatternInfo 