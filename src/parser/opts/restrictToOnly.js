const {valueRestrictionsViolated} = require('../../errors')

module.exports = ({errs = [], opts: OPTS = []} = {}) => {
  const opts = []

  for (let i = 0; i < OPTS.length; i++) {
    const option = OPTS[i]
    const {key, values, only} = option

    if (only === null || values === null || typeof only === 'undefined' || typeof values === 'undefined') {
      opts.push(option)
    } else {
      let correct = 0

      for (let j = 0; j < values.length; j++) {
        const value = values[j]
        if (only.indexOf(value) > -1) {
          correct++
        } else {
          errs.push(valueRestrictionsViolated({key, values, index: j, only, option}))
        }
      }

      if (values.length === correct) {
        opts.push(option)
      }
    }
  }

  return {errs, opts}
}