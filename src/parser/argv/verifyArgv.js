const {falseArgvRules, wrongArgvRulesType} = require('../errors')

module.exports = (rules = () => true) => ({errs = [], argv = []} = {}) => {
  const errs2 = []

  if (typeof rules === 'function') {
    if (rules(argv) === false) {
      errs2.push(falseArgvRules({rules, argv}))
    }
  } else {
    errs2.push(wrongArgvRulesType({type: typeof rules, argv}))
  }

  return {errs: errs.concat(errs2), argv}
}