const {falseImplication, wrongImplicationType} = require('../../errors')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {rules} = opt

    if (rules !== null) {
      if (typeof rules === 'function') {
        if (rules(opt)(opts) === false) {
          errs2.push(falseImplication({rules, option: opt}))
        }
      } else {
        errs2.push(wrongImplicationType({type: typeof rules, option: opt}))
      }
    }
  }

  return {errs: errs.concat(errs2), opts}
}