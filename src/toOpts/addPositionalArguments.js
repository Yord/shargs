module.exports = (opts = []) => ({errs = [], opts: opts2 = []} = {}) => {
  const errs2 = []
  const opts3 = []

  const posArgs = positionalArguments(opts)

  let at = 0

  let variadicValues = []

  for (let i = 0; i < opts2.length; i++) {
    const opt = opts2[i]

    if (isRest(opt) && posArgs.length > at) {
      const posArg = posArgs[at]

      if (typeof posArg.types === 'undefined') {
        variadicValues = variadicValues.concat(opt.values)
      } else {
        at++
        opts3.push({...posArg, values: opt.values})
      }
    } else {
      opts3.push(opt)
    }
  }

  if (variadicValues.length > 0 && posArgs.length > at && typeof posArgs[at].types === 'undefined') {
    const posArg = posArgs[at]
    const types = Array.from({length: variadicValues.length}, () => 'string')

    opts3.push({...posArg, types, values: variadicValues})
  }

  return {errs: errs.concat(errs2), opts: opts3}
}

function isRest (opt) {
  const keys = Object.keys(opt)
  return (
    keys.length === 1 &&
    keys[0] === 'values' &&
    Array.isArray(opt.values) &&
    opt.values.length === 1 &&
    opt.values[0] !== '--'
  )
}

function positionalArguments (opts) {
  return opts.filter(
    ({key, args}) => typeof key === 'string' && typeof args === 'undefined'
  )
}