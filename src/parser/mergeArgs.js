module.exports = parser => ({errs = [], argv = []} = {}) => {
  let errs2   = []
  const argv2 = {_: []}

  for (let i = 0; i < argv.length; i++) {
    const [arg, params, types, opts] = argv[i]

    if (typeof types === 'undefined') {
      if (arg !== '--') argv2['_'].push(arg)
    } else if (types === null) {
      const parse    = parser(opts || [])
      const {errs: errs3, argv} = parse({errs: [], argv: params})

      errs2      = errs3
      argv2[arg] = Object.assign({}, argv2[arg], argv)
    } else if (types.length === 0) {
      argv2[arg] = typeof argv2[arg] === 'undefined' ? true : argv2[arg] < 2 ? 2 : argv2[arg] + 1
    } else {
      argv2[arg] = types.length === 1 ? params[0] : params
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}