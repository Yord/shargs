module.exports = parsers => ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const {key, values, types, opts} = OPTS[i]

    if (Array.isArray(values)) {
      if (typeof types === 'undefined') {
        if (values.length !== 1 || values[0] !== '--') args['_'] = args['_'].concat(values)
      } else if (types === null) {
        const parentParser = parsers._
        const childParser  = typeof parsers[key] === 'function' ? parsers[key] : parentParser

        const child = childParser(opts || [])(values, [])
        errs2       = errs2.concat(child.errs || [])
        args[key]   = Object.assign({}, args[key], child.args)

        const parent = parentParser(noRestOrCommands(OPTS))(child.args._, [])
        errs2        = errs2.concat(parent.errs || [])
        args         = {...parent.args, ...args, _: args._.concat(parent.args._)}
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

function noRestOrCommands (opts) {
  return opts.filter(opt => isNoCommand(opt) && isNotRest(opt))
}

function isNoCommand ({types}) {
  return types !== null
}

function isNotRest ({types}) {
  return typeof types !== 'undefined'
}