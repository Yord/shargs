const {invalidRequiredPositionalArgument, invalidVariadicPositionalArgument, requiredPositionalArgumentMissing} = require('../errors')

module.exports = parsers => ({errs = [], opts: OPTS = []} = {}) => {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const {key, values, types, opts, posArgs} = OPTS[i]

    if (Array.isArray(values) && types === null) {
      const parentParser = parsers.__
      const childParser  = typeof parsers[key] === 'function' ? parsers[key] : parsers._

      if (typeof args[key] === 'undefined') {
        args[key] = {}

        const child = childParser(opts || [])(values, [])

        if (Array.isArray(posArgs)) {
          const errs3 = validatePositionalArguments(posArgs)
          errs2       = errs2.concat(errs3)

          for (let j = 0; j < posArgs.length; j++) {
            const posArg = posArgs[j]
            const {key: key2, types: types2, required = false, variadic = false} = posArg

            const values2 = child.args._.slice(0, variadic === true ? child.args._.length : types2.length)

            if (types2 === null && required === true && values2.length === 0) {
              errs2.push(requiredPositionalArgumentMissing({key: key2, positionalArgument: posArg}))
            } else if (types2 === null || values2.length === types2.length) {
               if (typeof args[key][key2] === 'undefined') {
                 args[key][key2] = values2.length === 1 ? values2[0] : values2
               }

               child.args._ = child.args._.slice(types2 === null ? child.args._.length : types2.length)
            } else {
              errs2.push(requiredPositionalArgumentMissing({key: key2, positionalArgument: posArg}))
            }
          }
        }

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

function validatePositionalArguments (posArgs) {
  const errs = []

  const invalidRequired = posArgs.reduce(
    (bool, {required = false}) => {
      if (required === false || required === true) {
        if (bool === null) {
          return required ? null : false
        } else {
          return bool || required
        }
      } else {
        return true
      }
    },
    null
  )

  if (invalidRequired === true) {
    errs.push(invalidRequiredPositionalArgument({positionalArguments: posArgs}))
  }

  const invalidVariadic = posArgs.slice(0, posArgs.length - 1).reduce(
    (bool, {variadic = false}) => bool || variadic,
    false
  )

  if (invalidVariadic === true) {
    errs.push(invalidVariadicPositionalArgument({positionalArguments: posArgs}))
  }

  return errs
}