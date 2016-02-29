import 'babel-polyfill'

import Cache from './Cache'
import Questions from './Questions'
import { QUESTIONS_ENDPOINT, ONE_WEEK } from './constants'

export default new Questions({
  endpoint: QUESTIONS_ENDPOINT,
  cache: new Cache({ stdTTL: ONE_WEEK })
})
