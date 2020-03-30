module.exports = ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const {key, types, values, defaultValues} = OPTS[i]

    if (typeof values === 'undefined' && typeof defaultValues !== 'undefined') {
      if (Array.isArray(types) && types.length === 1) {
        args[key] = Array.isArray(defaultValues) && defaultValues.length === 1 ? defaultValues[0] : defaultValues
      } else {
        args[key] = defaultValues
      }
    }
  }

  return {errs: errs.concat(errs2), args}
}