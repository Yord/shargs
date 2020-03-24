const {requiredOptionFormat, requiredOptionMissing} = require('../../errors')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {key, args, required, values} = opt

    if (required === true) {
      if (values === null || typeof values === 'undefined') {
        errs2.push(requiredOptionMissing({key, args, option: opt}))
      } else if (!Array.isArray(values)) {
        errs2.push(requiredOptionFormat({key, values, option: opt}))
      }
    }
  }

  return {errs: errs.concat(errs2), opts}
}