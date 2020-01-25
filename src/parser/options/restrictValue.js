const {argumentValueRestrictionsViolated} = require('../../errors')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []
  const opts2 = []

  for (let i = 0; i < opts.length; i++) {
    const option = opts[i]
    const {values, only} = option

    if (typeof only === 'undefined' || only === null) {
      opts2.push(option)
    } else {
      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (only.indexOf(value) > -1) {
          opts2.push(option)
        } else {
          errs2.push(argumentValueRestrictionsViolated({value, only, option}))
        }
      }
    }
  }

  return {errs: errs.concat(errs2), opts: opts2}
}