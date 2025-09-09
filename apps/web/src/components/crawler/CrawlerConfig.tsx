import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Slider } from '~/components/ui/slider'
import { useCrawler } from './CrawlerProvider'
import {
  CATEGORIES,
  type Category,
  type Subcategory,
} from '@roadcodetests/core'

export const CrawlerConfig: React.FC = () => {
  const { config, updateConfig, isRunning } = useCrawler()

  const handleCategoryChange = (category: Category) => {
    updateConfig({
      category,
      subcategory: 'all', // Reset subcategory when category changes
    })
  }

  const handleSubcategoryChange = (subcategory: string) => {
    updateConfig({
      subcategory: subcategory as Subcategory<Category> | 'all',
    })
  }

  const handleSliderChange = (field: keyof typeof config, value: number[]) => {
    updateConfig({ [field]: value[0] })
  }

  const subcategories =
    config.subcategory === 'all'
      ? ['all', ...CATEGORIES[config.category]]
      : ['all', ...CATEGORIES[config.category]]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🚗 Crawler Configuration</CardTitle>
        <CardDescription>
          Configure the driving test question crawler settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={config.category}
            onValueChange={handleCategoryChange}
            disabled={isRunning}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="motorbike">Motorbike</SelectItem>
              <SelectItem value="heavy_vehicle">Heavy Vehicle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory Selection */}
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={config.subcategory}
            onValueChange={handleSubcategoryChange}
            disabled={isRunning}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub === 'all'
                    ? 'All Subcategories'
                    : sub
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Advanced Settings</h4>

          {/* Maximum Empty Attempts */}
          <div className="space-y-2">
            <Label htmlFor="maxEmptyAttempts">
              Maximum Empty Attempts: {config.maximumEmptyAttempts}
            </Label>
            <Slider
              value={[config.maximumEmptyAttempts]}
              onValueChange={(value) =>
                handleSliderChange('maximumEmptyAttempts', value)
              }
              min={5}
              max={50}
              step={1}
              disabled={isRunning}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Stop crawling after this many consecutive duplicate questions
            </p>
          </div>

          {/* Timeout */}
          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (ms): {config.timeout}</Label>
            <Slider
              value={[config.timeout]}
              onValueChange={(value) => handleSliderChange('timeout', value)}
              min={5000}
              max={30000}
              step={1000}
              disabled={isRunning}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Page load timeout in milliseconds
            </p>
          </div>

          {/* Wait Time */}
          <div className="space-y-2">
            <Label htmlFor="waitTime">Wait Time (ms): {config.waitTime}</Label>
            <Slider
              value={[config.waitTime]}
              onValueChange={(value) => handleSliderChange('waitTime', value)}
              min={500}
              max={5000}
              step={100}
              disabled={isRunning}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Delay between page interactions
            </p>
          </div>

          {/* Max Attempts */}
          <div className="space-y-2">
            <Label htmlFor="maxAttempts">
              Max Attempts: {config.maxAttempts}
            </Label>
            <Slider
              value={[config.maxAttempts]}
              onValueChange={(value) =>
                handleSliderChange('maxAttempts', value)
              }
              min={5}
              max={50}
              step={1}
              disabled={isRunning}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Maximum retry attempts for page loading
            </p>
          </div>

          {/* Headless Mode */}
          <div className="flex items-center space-x-2">
            <Switch
              id="headless"
              checked={config.headless}
              onCheckedChange={(checked) => updateConfig({ headless: checked })}
              disabled={isRunning}
            />
            <Label htmlFor="headless">Headless Mode</Label>
            <p className="text-xs text-muted-foreground">
              Run browser in background (recommended)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
