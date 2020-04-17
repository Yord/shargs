module.exports = parsers => ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const opt = OPTS[i]
    const {key, values, opts} = opt

    if (Array.isArray(values) && isCommandOption(opt)) {
      const parentParser = parsers.__
      const childParser  = typeof parsers[key] === 'function' ? parsers[key] : parsers._

      if (typeof args[key] === 'undefined') {
        args[key] = {}

        const child = childParser(opts)(values, [])
        errs2       = errs2.concat(child.errs || [])
        args[key]   = child.args

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

function isCommandOption ({key, args, opts, types}) {
  return isOption({key, args}) && isVariadic({types}) && Array.isArray(opts)
}

function filter (opts) {
  return opts.filter(opt => isVariable(opt) && !isCommandOption(opt) && hasNoValues(opt))
}

function isVariable ({key}) {
  return typeof key !== 'undefined'
}

function isOption ({key, args}) {
  return isVariable({key}) && Array.isArray(args)
}

function isVariadic ({types}) {
  return typeof types === 'undefined'
}

function hasNoValues ({values}) {
  return typeof values === 'undefined'
}