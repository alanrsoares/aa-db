import cache from './src/cache'
import Questions from './src/Questions'
import { QUESTIONS_ENDPOINT } from './src/constants'

const q = new Questions({
  endpoint: QUESTIONS_ENDPOINT,
  cache
})

q.fetchQuestions()
