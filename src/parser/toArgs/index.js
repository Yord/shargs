module.exports = parser => ({errs = [], opts: OPTS = []} = {}) => {
  const args = {_: []}

  for (let i = 0; i < OPTS.length; i++) {
    const {key, values, types, opts} = OPTS[i]

    if (Array.isArray(values)) {
      if (typeof types === 'undefined') {
        if (values.length !== 1 || values[0] !== '--') args['_'] = args['_'].concat(values)
      } else if (types === null) {
        const parse = parser(opts || [])
        const res   = parse(values, [])
  
        errs      = errs.concat(res.errs || [])
        args[key] = Object.assign({}, args[key], res.args)
      } else if (types.length === 0) {
        args[key] = {type: 'flag', count: typeof args[key] === 'undefined' ? 1 : args[key].count + 1}
      } else {
        args[key] = types.length === 1 ? values[0] : values
      }
    }
  }

  return {errs, args}
}