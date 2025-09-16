# E2E Testing for Road Code Quiz Native App

This directory contains end-to-end tests for the Road Code Quiz Native App using Playwright.

## Test IDs

The following test IDs are available for E2E testing:

### HomeScreen

- `start-quiz-button` - Main start quiz button
- `category-{category}` - Category selection cards (e.g., `category-car`, `category-motorbike`)
- `subcategory-{subcategory}` - Subcategory selection chips (e.g., `subcategory-core`)
- `quiz-length-{number}` - Quiz length selection buttons (e.g., `quiz-length-10`)

### QuizScreen

- `quiz-back-button` - Back button in quiz header
- `question-text` - The current question text (dynamic content)
- `option-{letter}` - Quiz answer options (e.g., `option-a`, `option-b`, `option-c`, `option-d`)
- `previous-button` - Previous question button
- `next-button` - Next question button
- `finish-quiz-button` - Finish quiz button (appears on last question)

### ResultsScreen

- `score-percentage` - The quiz score percentage (dynamic content)
- `take-another-quiz-button` - Take another quiz button
- `back-to-home-button` - Back to home button

## Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run report
```

## Test Strategy

The tests focus on:

1. **Interactive Elements** - Buttons, cards, and selectable items
2. **Dynamic Content** - Question text and score that changes based on user actions
3. **Navigation Flow** - Moving between screens and completing the quiz flow

## Notes

- Tests use Playwright for cross-browser compatibility
- Test IDs are minimal and focused on essential user interactions
- Dynamic content like question text and scores are tested for presence and changes
- The app should be running on `http://localhost:8081` for tests to work
