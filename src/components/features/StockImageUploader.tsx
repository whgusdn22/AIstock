'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useAnalysisStore } from '@/lib/store'

const StockImageUploader = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const { setAnalyzing, setResult, setError } = useAnalysisStore()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // 이미지 미리보기
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // 분석 시작
    setAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('분석 요청에 실패했습니다.')
      }

      const result = await response.json()
      setResult(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setAnalyzing(false)
    }
  }, [setAnalyzing, setResult, setError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  })

  return (
    <Card className="w-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          차트 이미지 업로드
        </h2>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploadedImage ? (
            <div className="space-y-4">
              <img
                src={uploadedImage}
                alt="업로드된 차트"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                이미지가 업로드되었습니다. 분석을 시작합니다...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {isDragActive ? '여기에 파일을 놓으세요' : '차트 이미지를 업로드하세요'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, GIF 파일을 지원합니다
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setUploadedImage(null)
              useAnalysisStore.getState().reset()
            }}
            disabled={!uploadedImage}
          >
            다시 선택
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default StockImageUploader 