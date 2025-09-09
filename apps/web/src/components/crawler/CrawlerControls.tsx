import React from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { useCrawler } from './CrawlerProvider'
import {
  Play,
  Square,
  Trash2,
  Download,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

export const CrawlerControls: React.FC = () => {
  const {
    config,
    isRunning,
    startCrawling,
    stopCrawling,
    clearCache,
    questions,
  } = useCrawler()

  const handleStart = async () => {
    try {
      await startCrawling(config)
    } catch (error) {
      console.error('Failed to start crawler:', error)
    }
  }

  const handleStop = () => {
    stopCrawling()
  }

  const handleClearCache = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all cached questions? This action cannot be undone.',
      )
    ) {
      clearCache()
    }
  }

  const handleExport = () => {
    if (questions.length === 0) {
      alert('No questions to export')
      return
    }

    const dataStr = JSON.stringify(questions, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `driving-test-questions-${config.category}-${config.subcategory}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Crawler Controls
        </CardTitle>
        <CardDescription>
          Start, stop, and manage the question crawling process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            The crawler will open a browser window and automatically navigate
            through questions. Make sure to close other browser windows to avoid
            interference.
          </AlertDescription>
        </Alert>

        {/* Main Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex-1" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Crawling
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Crawling
            </Button>
          )}
        </div>

        {/* Secondary Controls */}
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={questions.length === 0 || isRunning}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Questions ({questions.length})
          </Button>

          <Button
            onClick={handleClearCache}
            variant="outline"
            disabled={isRunning}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>

        {/* Status Indicator */}
        {isRunning && (
          <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Crawling in progress...</span>
          </div>
        )}

        {/* Configuration Summary */}
        <div className="p-3 bg-muted rounded-md">
          <h4 className="text-sm font-medium mb-2">Current Configuration:</h4>
          <div className="text-xs space-y-1">
            <p>
              <strong>Category:</strong> {config.category}
            </p>
            <p>
              <strong>Subcategory:</strong> {config.subcategory}
            </p>
            <p>
              <strong>Max Empty Attempts:</strong> {config.maximumEmptyAttempts}
            </p>
            <p>
              <strong>Headless:</strong> {config.headless ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Timeout:</strong> {config.timeout}ms
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
