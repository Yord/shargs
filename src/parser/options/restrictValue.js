const {argumentValueRestrictionsViolated} = require('../../errors')

module.exports = ({errs = [], argv = []} = {}) => {
  const errs2 = []
  const argv2 = []

  for (let i = 0; i < argv.length; i++) {
    const option = argv[i]
    const {values, only} = option

    if (typeof only === 'undefined' || only === null) {
      argv2.push(option)
    } else {
      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (only.indexOf(value) > -1) {
          argv2.push(option)
        } else {
          errs2.push(argumentValueRestrictionsViolated({value, only, option}))
        }
      }
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}