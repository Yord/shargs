module.exports = parser => ({errs = [], argv = []} = {}) => {
  let errs2   = []
  const argv2 = {_: []}

  for (let i = 0; i < argv.length; i++) {
    const {key, values, types, opts} = argv[i]

    if (typeof types === 'undefined') {
      if (key !== '--') argv2['_'] = argv2['_'].concat(values)
    } else if (types === null) {
      const parse    = parser(opts || [])
      const {errs: errs3, argv} = parse({errs: [], argv: values})

      errs2      = errs3
      argv2[key] = Object.assign({}, argv2[key], argv)
    } else if (types.length === 0) {
      argv2[key] = typeof argv2[key] === 'undefined' ? true : argv2[key] < 2 ? 2 : argv2[key] + 1
    } else {
      argv2[key] = types.length === 1 ? values[0] : values
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}