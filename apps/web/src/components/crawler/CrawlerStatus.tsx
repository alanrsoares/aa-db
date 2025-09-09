import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Progress } from '~/components/ui/progress'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { useCrawler } from './CrawlerProvider'
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Database,
  Globe,
} from 'lucide-react'

const statusConfig = {
  initializing: {
    icon: Loader2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    label: 'Initializing',
  },
  ready: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    label: 'Ready',
  },
  loading: {
    icon: Loader2,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    label: 'Loading',
  },
  error: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    label: 'Error',
  },
  finished: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    label: 'Finished',
  },
}

export const CrawlerStatus: React.FC = () => {
  const { state, config } = useCrawler()

  // Use real state if available, otherwise show default state
  const currentState = state || {
    statusText: 'Ready to start',
    status: 'ready' as const,
    progress: {
      current: 0,
      total: config.maximumEmptyAttempts,
      percentage: 0,
    },
    stats: {
      newQuestions: 0,
      totalQuestions: 0,
      questionsByCategory: 0,
      emptyAttempts: 0,
      maxEmptyAttempts: config.maximumEmptyAttempts,
    },
    lastError: null,
    currentUrl: '',
  }
  const statusInfo =
    statusConfig[currentState.status as keyof typeof statusConfig]

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
              <statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
            </div>
            Crawler Status
          </CardTitle>
          <CardDescription>{currentState.statusText}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          {currentState.progress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{currentState.progress.percentage.toFixed(1)}%</span>
              </div>
              <Progress
                value={currentState.progress.percentage}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {currentState.progress.current} /{' '}
                  {currentState.progress.total}
                </span>
                <span>Empty attempts</span>
              </div>
            </div>
          )}

          {/* Current URL */}
          {currentState.currentUrl && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono truncate">
                {currentState.currentUrl}
              </span>
            </div>
          )}

          {/* Error Display */}
          {currentState.lastError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{currentState.lastError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {currentState.stats.newQuestions}
                </p>
                <p className="text-xs text-muted-foreground">New Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {currentState.stats.questionsByCategory}
                </p>
                <p className="text-xs text-muted-foreground">In Category</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {currentState.stats.totalQuestions}
                </p>
                <p className="text-xs text-muted-foreground">Total Cached</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {currentState.stats.emptyAttempts}/
                  {currentState.stats.maxEmptyAttempts}
                </p>
                <p className="text-xs text-muted-foreground">Empty Attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <Badge
          variant={currentState.status === 'error' ? 'destructive' : 'default'}
          className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}
        >
          <statusInfo.icon className="h-3 w-3 mr-1" />
          {statusInfo.label}
        </Badge>
      </div>
    </div>
  )
}
