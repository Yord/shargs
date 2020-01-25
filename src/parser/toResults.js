module.exports = parser => ({errs = [], opts = []} = {}) => {
  let errs2   = []
  const args = {_: []}

  for (let i = 0; i < opts.length; i++) {
    const {key, values, types, opts: opts2} = opts[i]

    if (typeof types === 'undefined') {
      if (key !== '--') args['_'] = args['_'].concat(values)
    } else if (types === null) {
      const parse    = parser(opts2 || [])
      const {errs: errs3, args: args2} = parse({errs: [], argv: values})

      errs2      = errs3
      args[key] = Object.assign({}, args[key], args2)
    } else if (types.length === 0) {
      args[key] = typeof args[key] === 'undefined' ? true : args[key] < 2 ? 2 : args[key] + 1
    } else {
      args[key] = types.length === 1 ? values[0] : values
    }
  }

  return {errs: errs.concat(errs2), args}
}