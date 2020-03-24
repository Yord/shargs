const {falseImplication, wrongImplicationType} = require('../../errors')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {implies} = opt

    if (implies !== null) {
      if (typeof implies === 'function') {
        if (implies(opt)(opts) === false) {
          errs2.push(falseImplication({implies, option: opt}))
        }
      } else {
        errs2.push(wrongImplicationType({type: typeof implies, option: opt}))
      }
    }
  }

  return {errs: errs.concat(errs2), opts}
}