module.exports = parsers => ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const {key, values, types, opts} = OPTS[i]

    if (Array.isArray(values) && types === null && Array.isArray(opts)) {
      const parentParser = parsers.__
      const childParser  = typeof parsers[key] === 'function' ? parsers[key] : parsers._

      if (typeof args[key] === 'undefined') {
        args[key] = {}

        const child = childParser(opts)(values, [])
        errs2       = errs2.concat(child.errs || [])
        args[key]   = Object.assign({}, args[key], child.args)

        if (typeof parentParser === 'function') {
          const parent = parentParser(filter(OPTS))(child.args._, [])
          errs2        = errs2.concat(parent.errs || [])
          args         = {...parent.args, ...args, _: args._.concat(parent.args._)}
        }
      }
    }
  }

  return {errs: errs.concat(errs2), args}
}

function filter (opts) {
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