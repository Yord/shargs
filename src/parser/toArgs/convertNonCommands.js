module.exports = ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const {key, values, types} = OPTS[i]

    if (Array.isArray(values) && types !== null) {
      if (typeof types === 'undefined') {
        if (values.length !== 1 || values[0] !== '--') args['_'] = args['_'].concat(values)
      } else if (Array.isArray(types) && types.length === 0) {
        args[key] = {
          type: 'flag',
          count: values.length === 0 ? 1 : typeof args[key] === 'undefined' ? values[0] : args[key].count + values[0]
        }
      } else {
        args[key] = types.length === 1 ? values[0] : values
      }
    }
  }

  return {errs: errs.concat(errs2), args}
}