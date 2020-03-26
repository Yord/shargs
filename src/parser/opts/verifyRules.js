const {falseRules, wrongRulesType} = require('../../errors')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {rules} = opt

    if (typeof rules !== 'undefined') {
      if (typeof rules === 'function') {
        if (rules(opt)(opts) === false) {
          errs2.push(falseRules({rules, option: opt}))
        }
      } else {
        errs2.push(wrongRulesType({type: typeof rules, option: opt}))
      }
    }
  }

  return {errs: errs.concat(errs2), opts}
}