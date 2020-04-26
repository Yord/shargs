const convertNonCommands = ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const opt = OPTS[i]
    const {key, values} = opt

    if (hasValues(opt) && !isCommandOption(opt)) {
      if (isFlagOption(opt)) {
        args[key] = {
          type: 'flag',
          count: typeof args[key] === 'undefined' ? values[0] : args[key].count + values[0]
        }
      } else if (isRest(opt)) {
        if (values[0] !== '--') args['_'] = args['_'].concat(values)
      } else if (typeof args[key] === 'undefined') {
        if (isPrimitiveVariable(opt)) {
          args[key] = values[0]
        } else if (isArrayVariable(opt)) {
          args[key] = values
        } else if (isVariadicVariable(opt)) {
          args[key] = values
        }
      }
    }
  }

  return {errs: errs.concat(errs2), args}
}

module.exports = {
  convertNonCommands
}

function isRest ({key, values}) {
  return typeof key === 'undefined' && Array.isArray(values) && values.length === 1 && typeof values[0] === 'string'
}

function isVariadicVariable (opt) {
  return isVariable(opt) && isVariadic(opt)
}

function isPrimitiveVariable ({key, types}) {
  return isVariable({key}) && Array.isArray(types) && types.length === 1
}

function isArrayVariable ({key, types}) {
  return isVariable({key}) && Array.isArray(types) && types.length > 1
}

function isFlagOption ({key, args, types}) {
  return isOption({key, args}) && Array.isArray(types) && types.length === 0
}

function isCommandOption ({key, args, opts, types}) {
  return isOption({key, args}) && isVariadic({types}) && Array.isArray(opts)
}

function hasValues ({values}) {
  return Array.isArray(values)
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