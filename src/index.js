import 'babel-polyfill'

import cache from './cache'
import Questions from './Questions'
import { QUESTIONS_ENDPOINT } from './constants'

const q = new Questions({
  endpoint: QUESTIONS_ENDPOINT,
  cache
})

q.fetchQuestions()
