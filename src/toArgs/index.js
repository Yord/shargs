const toArgs = ({errs = [], opts = []} = {errs: [], opts: []}) => {
  let errs2 = []
  let args  = []
  
  args.push({_: []})

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]

    if (isObject(opt)) {
      switch (true) {
        case isRest(opt): {
          if (opt.values[0] !== '--') {
            args[0] = {
              ...args[0],
              _: [
                ...args[0]._,
                ...opt.values
              ]
            }
          }
          break
        }
        case isFlag(opt): {
          args[0] = {
            ...args[0],
            [opt.key]: (
              isUndefined(args[0][opt.key])
                ? {type: 'flag', count: opt.values[0]}
                : {
                  ...args[0][opt.key],
                  count: args[0][opt.key].count + opt.values[0]
                }
            )
          }
          break
        }
        case isPrimitive(opt): {
          args[0] = {
            ...args[0],
            ...(isUndefined(args[0][opt.key]) ? {[opt.key]: opt.values[0]} : {})
          }
          break
        }
        case isArray(opt): {
          args[0] = {
            ...args[0],
            ...(isUndefined(args[0][opt.key]) ? {[opt.key]: opt.values} : {})
          }
          break
        }
        case isSubcommand(opt): {
          const {errs: errs3, args: args2} = toArgs({opts: opt.values})
  
          errs2 = [...errs2, ...errs3]
  
          for (let j = 0; j < args2.length; j++) {
            const arg = args2[j]
  
            args.push({[opt.key]: arg})
          }
        }
      }
    }
  }

  return {errs, args}
}

module.exports = {
  toArgs
}

function isObject (a) {
  return !Array.isArray(a) && a !== null && typeof a === 'object'
}

function isRest ({key, types, opts, values}) {
  return [key, types, opts].every(isUndefined) && arrLen(values, _ => _ > 0)
}

function isFlag ({key, types, opts, values}) {
  return isString(key) && arrLen(types, _ => _ === 0) && isUndefined(opts) && arrLen(values, _ => _ > 0)
}

function isPrimitive ({key, types, opts, values}) {
  return isString(key) && arrLen(types, _ => _ === 1) && isUndefined(opts) && arrLen(values, _ => _ === 1)
}

function isArray ({key, types, opts, values}) {
  return isString(key) && arrLen(types, _ => _ > 1) && isUndefined(opts) && arrLen(values, _ => _ === types.length)
}

function isSubcommand ({key, types, opts, values}) {
  return isString(key) && isUndefined(types) && Array.isArray(opts) && Array.isArray(values)
}

function arrLen (a, p) {
  return Array.isArray(a) && p(a.length)
}

function isUndefined (a) {
  return typeof a === 'undefined'
}

function isString (a) {
  return typeof a === 'string'
}