import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    // Python 백엔드로 요청 전달
    const formData = await request.formData()
    
    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.detail || '분석 중 오류가 발생했습니다.' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('API 호출 중 오류:', error)
    return NextResponse.json(
      { error: '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.' },
      { status: 500 }
    )
  }
} 