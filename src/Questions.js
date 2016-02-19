import fetch from 'isomorphic-fetch'

import { parseProps, parseTags } from './parsers'

const parseAnswers = answers => {
  const links = parseTags('a', 'g')(answers)
  const contents = links.map(parseTags('a'))
  const spans = contents.map(parseTags('span', 'g'))
  const spanContent = parseTags('span')

  return spans.reduce((acc, [option, content]) => ({
    ...acc,
    [spanContent(option)]: spanContent(content).trim()
  }), {})
}

const unwrap = res => res.json()

const refineQuestion = question => ({
  ...question,
  key: question.Question,
  Image: parseProps(['src', 'alt'])(question.Image),
  Answers: parseAnswers(question.Answers)
})

const refine = data => Promise.resolve(data.map(refineQuestion))

export default class Questions {
  constructor({ endpoint, cache, maximumEmptyAttempts = 10 }) {
    Object.assign(this, {
      endpoint,
      cache,
      maximumEmptyAttempts,
      emptyAttempts: 0,
      store: this.store.bind(this)
    })
  }

  store(questions) {
    const uncachedQuestions = questions.filter(q => !this.cache.get(q.key))

    if (!uncachedQuestions.length) {
      this.emptyAttempts++
      console.log(`empty attempts: ${this.emptyAttempts}`)
    } else {
      this.emptyAttempts = 0
      uncachedQuestions.forEach(q => this.cache.set(q.key, q))
      console.log(`new questions cached: ${uncachedQuestions.length}`)
    }

    this.fetchQuestions()
  }

  fetchQuestions() {
    if (this.emptyAttempts >= this.maximumEmptyAttempts) {
      console.log(`operation cancelled after ${this.maximumEmptyAttempts} empty attempts`)
      return
    }

    fetch(this.endpoint)
      .then(unwrap)
      .then(refine)
      .then(this.store)
      .catch(::console.log)
  }
}
