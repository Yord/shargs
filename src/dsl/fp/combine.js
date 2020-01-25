const {invalidTypesInArgument, nonMatchingArgumentTypes, invalidOptionsListInCombine} = require('../../errors')

module.exports = (...options) => {
  let errs   = []
  const args = {}

  for (let i = 0; i < options.length; i++) {
    const {errs: ERRS = [], args: ARGS} = options[i]

    if (ERRS.length > 0) {
      errs = errs.concat(ERRS)
    } else {
      const keys = Object.keys(ARGS)

      for (let j = 0; j < keys.length; j++) {
        const arg  = keys[j]
        const list = ARGS[arg]
        if (typeof args[arg] === 'undefined') {
          if (typeof list === 'undefined' || list === null || list.length === 0) {
            errs.push(invalidOptionsListInCombine({list, arg, option: options[i]}))
          } else {
            for (let k = 0; k < list.length; k++) {
              const argument = list[k]
              if (!(Array.isArray(argument.types) || argument.types === null)) {
                errs.push(invalidTypesInArgument({types: argument.types, argument}))
              } else {
                if (typeof args[arg] === 'undefined') args[arg] = []
                args[arg].push(argument)
              }
            }
          }
        } else {
          const ref   = args[arg][0]
          const types = ref.types
          for (let k = 0; k < list.length; k++) {
            const argument = list[k]
            if (!(Array.isArray(argument.types) || argument.types === null)) {
              errs.push(invalidTypesInArgument({types: argument.types, argument}))
            } else if ((argument.types || []).length === (types || []).length) {
              args[arg].push(argument)
            } else {
              errs.push(nonMatchingArgumentTypes({arg, ref, argument}))
            }
          }
        }
      }
    }
  }

  return {errs, args}
}