const {invalidDefaultValues} = require('../errors')

module.exports = ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const opt = OPTS[i]
    const {key, types, values, defaultValues} = opt

    if (typeof values === 'undefined' && typeof defaultValues !== 'undefined') {
      if (!Array.isArray(types)) {
        args[key] = defaultValues
      } else if (types.length === 0 && typeof defaultValues === 'object' && isFlag(defaultValues)) {
        args[key] = defaultValues
      } else if (Array.isArray(defaultValues) && types.length === defaultValues.length) {
        args[key] = defaultValues.length === 1 ? defaultValues[0] : defaultValues
      } else {
        errs2.push(invalidDefaultValues({defaultValues, option: opt}))
      }
    }
  }

  return {errs: errs.concat(errs2), args}
}

function isFlag ({type, count}) {
  return type === 'flag' && typeof count === 'number'
}