import StockImageUploader from '@/components/features/StockImageUploader'
import AnalysisResultDisplay from '@/components/features/AnalysisResultDisplay'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 상단: 서비스 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI 주식 차트 분석기
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            업로드한 차트 이미지를 AI가 분석하여 투자 판단에 도움이 되는 정보를 제공합니다
          </p>
        </div>

        {/* 중앙: 이미지 업로더 */}
        <div className="max-w-2xl mx-auto mb-12">
          <StockImageUploader />
        </div>

        {/* 하단: 분석 결과 표시 */}
        <div className="max-w-4xl mx-auto">
          <AnalysisResultDisplay />
        </div>
      </div>
    </main>
  )
} 