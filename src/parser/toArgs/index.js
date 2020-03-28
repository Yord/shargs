module.exports = parser => ({errs = [], opts: OPTS = []} = {}) => {
  let args = {_: []}

  for (let i = 0; i < OPTS.length; i++) {
    const {key, values, types, opts} = OPTS[i]

    if (Array.isArray(values)) {
      if (typeof types === 'undefined') {
        if (values.length !== 1 || values[0] !== '--') args['_'] = args['_'].concat(values)
      } else if (types === null) {
        const child = parser(opts || [])(values, [])
        errs        = errs.concat(child.errs || [])
        args[key]   = Object.assign({}, args[key], child.args)

        const parent = parser(noCommands(OPTS))(child.args._, [])
        const parent = parser(freeOpts(OPTS))(child.args._, [])
        errs         = errs.concat(parent.errs || [])
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

  return {errs, args}
}

function freeOpts (opts) {
  return opts.filter(opt => isNoCommand(opt) && isNotRest(opt) && hasNoValues(opt))
}

function isNoCommand ({types}) {
  return types !== null
}

function isNotRest ({types}) {
  return typeof types !== 'undefined'
}

function hasNoValues ({values}) {
  return typeof values === 'undefined'
}