import React, { createContext, useContext, useRef } from 'react'
import type {
  Category,
  DrivingTestQuestionWithKey,
  Subcategory,
} from '@roadcodetests/core'
import type {
  WebCrawlerConfig,
  WebCrawlerState,
} from '~/lib/crawler-integration'
import { WebCrawler } from '~/lib/crawler-integration'

// Web-specific crawler state interface
export interface CrawlerConfig {
  category: Category
  subcategory: Subcategory<Category> | 'all'
  maximumEmptyAttempts: number
  headless: boolean
  timeout: number
  maxAttempts: number
  waitTime: number
  quizLength: number
}

export interface CrawlerContextValue {
  state: WebCrawlerState | null
  config: CrawlerConfig
  isRunning: boolean
  startCrawling: (config: CrawlerConfig) => Promise<void>
  stopCrawling: () => void
  updateConfig: (updates: Partial<CrawlerConfig>) => void
  questions: Array<DrivingTestQuestionWithKey<Category>>
  clearCache: () => void
}

const CrawlerContext = createContext<CrawlerContextValue | null>(null)

export const useCrawler = () => {
  const context = useContext(CrawlerContext)
  if (!context) {
    throw new Error('useCrawler must be used within a CrawlerProvider')
  }
  return context
}

interface CrawlerProviderProps {
  children: React.ReactNode
}

export const CrawlerProvider: React.FC<CrawlerProviderProps> = ({
  children,
}) => {
  const crawlerRef = useRef<WebCrawler | null>(null)
  const [state, setState] = React.useState<WebCrawlerState | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)
  const [questions, setQuestions] = React.useState<
    Array<DrivingTestQuestionWithKey<Category>>
  >([])

  const [config, setConfig] = React.useState<CrawlerConfig>({
    category: 'car',
    subcategory: 'all',
    maximumEmptyAttempts: 25,
    headless: true,
    timeout: 10000,
    maxAttempts: 20,
    waitTime: 1000,
    quizLength: 1,
  })

  const updateConfig = (updates: Partial<CrawlerConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const startCrawling = async (crawlerConfig: CrawlerConfig): Promise<void> => {
    try {
      setIsRunning(true)
      setConfig(crawlerConfig)

      // Create new crawler instance
      const webCrawlerConfig: WebCrawlerConfig = {
        category: crawlerConfig.category,
        subcategory: crawlerConfig.subcategory,
        maximumEmptyAttempts: crawlerConfig.maximumEmptyAttempts,
        headless: crawlerConfig.headless,
        timeout: crawlerConfig.timeout,
        maxAttempts: crawlerConfig.maxAttempts,
        waitTime: crawlerConfig.waitTime,
        quizLength: crawlerConfig.quizLength,
      }

      const crawler = new WebCrawler(webCrawlerConfig)
      crawlerRef.current = crawler

      // Set up state listener
      const unsubscribe = crawler.onStateChange((newState: WebCrawlerState) => {
        setState(newState)
      })

      // Start crawling
      const newQuestions = await crawler.start()
      setQuestions(newQuestions)

      // Clean up listener
      unsubscribe()
    } catch (error) {
      console.error('Error starting crawler:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const stopCrawling = () => {
    if (crawlerRef.current) {
      crawlerRef.current.stop()
      crawlerRef.current = null
    }
    setIsRunning(false)
  }

  const clearCache = () => {
    if (crawlerRef.current) {
      crawlerRef.current.clearCache()
    }
    setQuestions([])
  }

  const contextValue: CrawlerContextValue = {
    state,
    config,
    isRunning,
    startCrawling,
    stopCrawling,
    updateConfig,
    questions,
    clearCache,
  }

  return (
    <CrawlerContext.Provider value={contextValue}>
      {children}
    </CrawlerContext.Provider>
  )
}
