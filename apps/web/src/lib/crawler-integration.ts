// Web-compatible crawler integration
// This file provides a bridge between the web UI and the core crawler functionality

import type {
  Category,
  Subcategory,
  DrivingTestQuestionWithKey,
  DrivingTestState,
} from '@roadcodetests/core'

export interface WebCrawlerConfig {
  category: Category
  subcategory: Subcategory<Category> | 'all'
  maximumEmptyAttempts: number
  headless: boolean
  timeout: number
  maxAttempts: number
  waitTime: number
  quizLength: number
}

export interface WebCrawlerState {
  statusText: string
  status: 'initializing' | 'ready' | 'loading' | 'error' | 'finished'
  progress: {
    current: number
    total: number
    percentage: number
  }
  stats: {
    newQuestions: number
    totalQuestions: number
    questionsByCategory: number
    emptyAttempts: number
    maxEmptyAttempts: number
  }
  lastError: string | null
  currentUrl: string
}

export class WebCrawler {
  private config: WebCrawlerConfig
  private state: WebCrawlerState
  private stateListeners: Array<(state: WebCrawlerState) => void> = []
  private isRunning = false
  private questions: Array<DrivingTestQuestionWithKey<Category>> = []

  constructor(config: WebCrawlerConfig) {
    this.config = config
    this.state = this.createInitialState()
  }

  private createInitialState(): WebCrawlerState {
    return {
      statusText: 'Ready to start',
      status: 'ready',
      progress: {
        current: 0,
        total: this.config.maximumEmptyAttempts,
        percentage: 0,
      },
      stats: {
        newQuestions: 0,
        totalQuestions: 0,
        questionsByCategory: 0,
        emptyAttempts: 0,
        maxEmptyAttempts: this.config.maximumEmptyAttempts,
      },
      lastError: null,
      currentUrl: this.getCurrentUrl(),
    }
  }

  private getCurrentUrl(): string {
    const { category, subcategory, quizLength } = this.config
    return `https://www.drivingtests.co.nz/roadcode/${category}/${subcategory}/${quizLength}/`
  }

  private updateState(updates: Partial<WebCrawlerState>): void {
    this.state = { ...this.state, ...updates }
    this.notifyStateListeners()
  }

  private notifyStateListeners(): void {
    this.stateListeners.forEach((listener) => listener(this.state))
  }

  public onStateChange(listener: (state: WebCrawlerState) => void): () => void {
    this.stateListeners.push(listener)
    return () => {
      const index = this.stateListeners.indexOf(listener)
      if (index > -1) {
        this.stateListeners.splice(index, 1)
      }
    }
  }

  public getState(): WebCrawlerState {
    return this.state
  }

  public getQuestions(): Array<DrivingTestQuestionWithKey<Category>> {
    return this.questions
  }

  public async start(): Promise<Array<DrivingTestQuestionWithKey<Category>>> {
    if (this.isRunning) {
      throw new Error('Crawler is already running')
    }

    this.isRunning = true
    this.updateState({
      status: 'initializing',
      statusText: 'Initializing crawler...',
      progress: {
        current: 0,
        total: this.config.maximumEmptyAttempts,
        percentage: 0,
      },
    })

    try {
      // Simulate the crawling process
      await this.simulateCrawling()

      this.updateState({
        status: 'finished',
        statusText: 'Crawling completed successfully',
        progress: {
          current: this.config.maximumEmptyAttempts,
          total: this.config.maximumEmptyAttempts,
          percentage: 100,
        },
      })

      return this.questions
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      this.updateState({
        status: 'error',
        statusText: 'Crawling failed',
        lastError: errorMessage,
      })
      throw error
    } finally {
      this.isRunning = false
    }
  }

  public stop(): void {
    this.isRunning = false
    this.updateState({
      status: 'ready',
      statusText: 'Crawling stopped',
    })
  }

  public clearCache(): void {
    this.questions = []
    this.updateState({
      stats: {
        ...this.state.stats,
        newQuestions: 0,
        totalQuestions: 0,
        questionsByCategory: 0,
      },
    })
  }

  private async simulateCrawling(): Promise<void> {
    const { maximumEmptyAttempts } = this.config

    for (let i = 0; i < maximumEmptyAttempts; i++) {
      if (!this.isRunning) break

      this.updateState({
        status: 'loading',
        statusText: `Crawling question ${i + 1}/${maximumEmptyAttempts}...`,
        progress: {
          current: i,
          total: maximumEmptyAttempts,
          percentage: (i / maximumEmptyAttempts) * 100,
        },
        currentUrl: this.getCurrentUrl(),
      })

      // Simulate question fetching
      await this.delay(1000)

      // Simulate finding a new question (70% chance)
      const isNewQuestion = Math.random() > 0.3

      if (isNewQuestion) {
        const mockQuestion = this.createMockQuestion(i)
        this.questions.push(mockQuestion)

        this.updateState({
          stats: {
            ...this.state.stats,
            newQuestions: this.state.stats.newQuestions + 1,
            totalQuestions: this.questions.length,
            questionsByCategory: this.questions.length,
            emptyAttempts: 0,
          },
          statusText: `Found new question! Total: ${this.questions.length}`,
        })
      } else {
        this.updateState({
          stats: {
            ...this.state.stats,
            emptyAttempts: this.state.stats.emptyAttempts + 1,
          },
          statusText: `Duplicate question found (${this.state.stats.emptyAttempts + 1}/${maximumEmptyAttempts} empty attempts)`,
        })
      }
    }
  }

  private createMockQuestion(
    index: number,
  ): DrivingTestQuestionWithKey<Category> {
    const questions = [
      'What should you do when approaching a roundabout?',
      'When should you use your hazard lights?',
      'What is the speed limit in a school zone?',
      'How far should you stay behind the vehicle in front?',
      'When can you overtake on the left?',
    ]

    const options = [
      { letter: 'A', text: 'Slow down and give way to traffic from the right' },
      { letter: 'B', text: 'Speed up to get through quickly' },
      { letter: 'C', text: 'Stop completely before entering' },
      { letter: 'D', text: 'Use your horn to warn other drivers' },
    ]

    const answers = ['A', 'B', 'C']
    const explanations = [
      'This is the correct answer because...',
      'You should always follow this rule when...',
      'This ensures safety for all road users...',
    ]

    return {
      question: questions[index % questions.length],
      options: options,
      answer: answers[index % answers.length],
      explanation: {
        text: explanations[index % explanations.length],
        imageUrl:
          index % 3 === 0 ? `https://example.com/image${index}.jpg` : undefined,
      },
      imageUrl:
        index % 2 === 0
          ? `https://example.com/question${index}.jpg`
          : undefined,
      key: `mock_question_${index}`,
      category: this.config.category,
      subcategory:
        this.config.subcategory === 'all' ? 'core' : this.config.subcategory,
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
