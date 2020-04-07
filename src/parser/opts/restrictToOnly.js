const traverseOpts = require('./traverseOpts')
const {valueRestrictionsViolated} = require('../errors')
const and = require('../combinators/and')

module.exports = traverseOpts(and(hasOnly, hasValues))(opt => {
  const errs = []
  const opts = []

  const {key, values, only} = opt

  let correct = 0

  for (let i = 0; i < values.length; i++) {
    const value = values[i]
    if (only.indexOf(value) > -1) {
      correct++
    } else {
      errs.push(valueRestrictionsViolated({key, values, index: i, only, option: opt}))
    }
  }

  if (values.length === correct) {
    opts.push(opt)
  }

  return {errs, opts}
})

function hasOnly ({only}) {
  return only !== null && typeof only !== 'undefined'
}

function hasValues ({values}) {
  return values !== null && typeof values !== 'undefined'
}