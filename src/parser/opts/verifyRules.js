const traverseOpts = require('./traverseOpts')
const {falseRules, wrongRulesType} = require('../errors')

module.exports = traverseOpts(hasRules)((opt, _, opts) => {
  const errs = []

  const {key, rules} = opt

  if (validRules(opt)) {
    if (rules(opt)(opts) === false) {
      errs.push(falseRules({key, rules, option: opt}))
    }
  } else {
    errs.push(wrongRulesType({key, type: typeof rules, option: opt}))
  }

  return {errs}
})

function hasRules ({rules}) {
  return typeof rules !== 'undefined'
}

function validRules ({rules}) {
  return typeof rules === 'function'
}