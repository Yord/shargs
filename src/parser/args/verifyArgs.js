const {falseArgsRules, wrongArgsRulesType} = require('../errors')

module.exports = (rules = () => true) => ({errs = [], args = []} = {}) => {
  const errs2 = []

  if (typeof rules === 'function') {
    if (rules(args) === false) {
      errs2.push(falseArgsRules({rules, args}))
    }
  } else {
    errs2.push(wrongArgsRulesType({type: typeof rules, args}))
  }

  return {errs: errs.concat(errs2), args}
}