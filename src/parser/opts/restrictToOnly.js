const {argumentValueRestrictionsViolated} = require('../../errors')

module.exports = ({errs = [], opts: OPTS = []} = {}) => {
  const opts = []

  for (let i = 0; i < OPTS.length; i++) {
    const option = OPTS[i]
    const {values, only} = option

    if (typeof only === 'undefined' || only === null) {
      opts.push(option)
    } else {
      let correct = 0

      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (only.indexOf(value) > -1) {
          correct++
        } else {
          errs.push(argumentValueRestrictionsViolated({value, only, option}))
        }
      }

      if (values.length === correct) {
        opts.push(option)
      }
    }
  }

  return {errs, opts}
}