import { create } from 'zustand'

export interface AnalysisResult {
  prediction: {
    up_probability: number
    down_probability: number
  }
  technical_patterns: string[]
  sentiment: {
    score: number
    status: string
  }
  chart_analysis?: {
    trend: string
    patterns: string[]
    support_level: string
    resistance_level: string
    prediction: {
      up_probability: number
      down_probability: number
      confidence: string
    }
    technical_indicators: {
      rsi: string
      macd: string
      moving_averages: string
    }
    risk_level: string
    summary: string
  }
  sentiment_analysis?: {
    score: number
    status: string
    key_factors: string[]
    market_sentiment: string
    news_sentiment: string
    social_sentiment: string
  }
  investment_advice?: {
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
  overall_score?: {
    score: number
    grade: string
    confidence: string
    breakdown: {
      chart_score: number
      sentiment_score: number
      pattern_score: number
    }
  }
  analysis_timestamp?: string
  image_metadata?: {
    filename: string
    size: number
    format: string
    dimensions: [number, number]
  }
}

interface AnalysisStore {
  isAnalyzing: boolean
  result: AnalysisResult | null
  error: string | null
  setAnalyzing: (analyzing: boolean) => void
  setResult: (result: AnalysisResult) => void
  setError: (error: string) => void
  reset: () => void
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  isAnalyzing: false,
  result: null,
  error: null,
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setResult: (result) => set({ result, error: null }),
  setError: (error) => set({ error, result: null }),
  reset: () => set({ isAnalyzing: false, result: null, error: null }),
})) 