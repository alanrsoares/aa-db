import React from 'react'
import { CrawlerProvider } from '~/components/crawler/CrawlerProvider'
import { CrawlerConfig } from '~/components/crawler/CrawlerConfig'
import { CrawlerStatus } from '~/components/crawler/CrawlerStatus'
import { CrawlerControls } from '~/components/crawler/CrawlerControls'
import { QuestionsList } from '~/components/crawler/QuestionsList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

const CrawlerPageContent: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🚗 Driving Test Question Crawler</h1>
        <p className="text-muted-foreground">
          Automatically crawl and cache driving test questions from
          drivingtests.co.nz
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <CrawlerConfig />
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <CrawlerStatus />
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <CrawlerControls />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <QuestionsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const CrawlerPage: React.FC = () => {
  return (
    <CrawlerProvider>
      <CrawlerPageContent />
    </CrawlerProvider>
  )
}
