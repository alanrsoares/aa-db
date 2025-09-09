import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useCrawler } from './CrawlerProvider'
import {
  Search,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  FileText,
} from 'lucide-react'
import type { DrivingTestQuestionWithKey } from '@roadcodetests/core'

interface QuestionCardProps {
  question: DrivingTestQuestionWithKey<any>
  isExpanded: boolean
  onToggle: () => void
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isExpanded,
  onToggle,
}) => {
  const answerArray = Array.isArray(question.answer)
    ? question.answer
    : [question.answer]

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm line-clamp-2">
              {question.question}
            </CardTitle>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {question.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {question.subcategory}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Key: {question.key}
                </span>
              </div>
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Question Image */}
          {question.imageUrl && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Question Image</span>
              </div>
              <img
                src={question.imageUrl}
                alt="Question"
                className="max-w-full h-auto rounded-md border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Options */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Options
            </h4>
            <div className="space-y-2">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-2 rounded-md border ${
                    answerArray.includes(option.letter)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        answerArray.includes(option.letter)
                          ? 'default'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {option.letter}
                    </Badge>
                    <span className="text-sm">{option.text}</span>
                    {option.imageUrl && (
                      <img
                        src={option.imageUrl}
                        alt={`Option ${option.letter}`}
                        className="w-8 h-8 rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answer */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Correct Answer</h4>
            <div className="flex gap-2">
              {answerArray.map((answer, index) => (
                <Badge key={index} variant="default" className="bg-green-600">
                  {answer}
                </Badge>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div>
              <h4 className="text-sm font-medium mb-2">Explanation</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {question.explanation.text}
              </p>
              {question.explanation.imageUrl && (
                <img
                  src={question.explanation.imageUrl}
                  alt="Explanation"
                  className="max-w-full h-auto rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export const QuestionsList: React.FC = () => {
  const { questions } = useCrawler()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  )

  const toggleExpanded = (questionKey: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionKey)) {
      newExpanded.delete(questionKey)
    } else {
      newExpanded.add(questionKey)
    }
    setExpandedQuestions(newExpanded)
  }

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.options.some((opt) =>
        opt.text.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    const matchesCategory =
      filterCategory === 'all' || question.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(questions.map((q) => q.category)))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Cached Questions ({questions.length})
        </CardTitle>
        <CardDescription>
          Browse and inspect the questions that have been crawled and cached
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {questions.length === 0 ? (
              <div>
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No questions cached yet</p>
                <p className="text-sm">Start crawling to collect questions</p>
              </div>
            ) : (
              <div>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No questions match your search</p>
                <p className="text-sm">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question.key}
                question={question}
                isExpanded={expandedQuestions.has(question.key)}
                onToggle={() => toggleExpanded(question.key)}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {questions.length > 0 && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Total Questions</p>
                <p className="text-muted-foreground">{questions.length}</p>
              </div>
              <div>
                <p className="font-medium">Categories</p>
                <p className="text-muted-foreground">{categories.length}</p>
              </div>
              <div>
                <p className="font-medium">With Images</p>
                <p className="text-muted-foreground">
                  {questions.filter((q) => q.imageUrl).length}
                </p>
              </div>
              <div>
                <p className="font-medium">With Explanations</p>
                <p className="text-muted-foreground">
                  {questions.filter((q) => q.explanation?.text).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
