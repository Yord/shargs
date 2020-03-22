const {invalidTypesInArgument, nonMatchingArgumentTypes, invalidOptionsListInCombine} = require('../../errors')

module.exports = (...ARGUMENTS) => {
  let errs   = []
  const args = {}

  for (let i = 0; i < ARGUMENTS.length; i++) {
    const {errs: ERRS = [], args: ARGS = []} = ARGUMENTS[i]

    if (ERRS.length > 0) {
      errs = errs.concat(ERRS)
    } else {
      const keys = Object.keys(ARGS)

      for (let j = 0; j < keys.length; j++) {
        const arg     = keys[j]
        const options = ARGS[arg]
        if (typeof args[arg] === 'undefined') {
          if (!Array.isArray(options) || options.length === 0) {
            errs.push(invalidOptionsListInCombine({options, arg, argument: ARGUMENTS[i]}))
          } else {
            for (let k = 0; k < options.length; k++) {
              const option = options[k]
              if (!(Array.isArray(option.types) || option.types === null)) {
                errs.push(invalidTypesInArgument({types: option.types, option}))
              } else {
                if (typeof args[arg] === 'undefined') args[arg] = []
                args[arg].push(option)
              }
            }
          }
        } else {
          const ref   = args[arg][0]
          const types = ref.types
          for (let k = 0; k < options.length; k++) {
            const option = options[k]
            if (!(Array.isArray(option.types) || option.types === null)) {
              errs.push(invalidTypesInArgument({types: option.types, option}))
            } else if ((option.types || []).length === (types || []).length) {
              args[arg].push(option)
            } else {
              errs.push(nonMatchingArgumentTypes({arg, ref, option}))
            }
          }
        }
      }
    }
  }

  return {errs, args}
}