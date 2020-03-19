module.exports = parser => ({errs = [], opts: OPTS = []} = {}) => {
  const args = {_: []}

  for (let i = 0; i < OPTS.length; i++) {
    const {key, values: argv, types, opts} = OPTS[i]

    if (typeof types === 'undefined') {
      if (argv.length !== 1 || argv[0] !== '--') args['_'] = args['_'].concat(argv)
    } else if (types === null) {
      const parse = parser(opts || [])
      const res   = parse(argv, [])

      errs      = errs.concat(res.errs || [])
      args[key] = Object.assign({}, args[key], res.args)
    } else if (types.length === 0) {
      args[key] = typeof args[key] === 'undefined' ? {count: 1} : {count: args[key].count + 1}
    } else {
      args[key] = types.length === 1 ? argv[0] : argv
    }
  }

  return {errs, args}
}