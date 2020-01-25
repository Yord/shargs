const {argumentValueRestrictionsViolated} = require('../../errors')

module.exports = ({errs: ERRS = [], opts: OPTS = []} = {}) => {
  const errs = []
  const opts = []

  for (let i = 0; i < OPTS.length; i++) {
    const option = OPTS[i]
    const {values, only} = option

    if (typeof only === 'undefined' || only === null) {
      opts.push(option)
    } else {
      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (only.indexOf(value) > -1) {
          opts.push(option)
        } else {
          errs.push(argumentValueRestrictionsViolated({value, only, option}))
        }
      }
    }
  }

  return {errs: ERRS.concat(errs), opts}
}