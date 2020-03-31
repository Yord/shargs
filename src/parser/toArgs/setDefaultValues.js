const {invalidDefaultValues} = require('../../errors')

module.exports = ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const opt = OPTS[i]
    const {key, types, values, defaultValues} = opt

    if (typeof values === 'undefined' && typeof defaultValues !== 'undefined') {
      if (Array.isArray(types)) {
        if (Array.isArray(defaultValues) && defaultValues.length === types.length) {
          args[key] = defaultValues.length === 1 ? defaultValues[0] : defaultValues
        } else {
          errs2.push(invalidDefaultValues({defaultValues, option: opt}))
        }
      } else {
        args[key] = defaultValues
      }
    }
  }

  return {errs: errs.concat(errs2), args}
}