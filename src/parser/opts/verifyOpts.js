const {falseOptsRules, wrongOptsRulesType} = require('../../errors')

module.exports = (rules = () => true) => ({errs = [], opts = []} = {}) => {
  const errs2 = []

  if (typeof rules === 'function') {
    if (rules(opts) === false) {
      errs2.push(falseOptsRules({rules, options: opts}))
    }
  } else {
    errs2.push(wrongOptsRulesType({type: typeof rules, options: opts}))
  }

  return {errs: errs.concat(errs2), opts}
}