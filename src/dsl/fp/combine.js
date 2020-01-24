module.exports = (...options) => {
  let errs2   = []
  const args2 = {}

  for (let i = 0; i < options.length; i++) {
    const {errs = [], args} = options[i]

    if (errs.length > 0) {
      errs2 = errs2.concat(errs)
    } else {
      const keys = Object.keys(args)

      for (let j = 0; j < keys.length; j++) {
        const arg  = keys[j]
        const list = args[arg]
        if (typeof args2[arg] === 'undefined') {
          if (typeof list === 'undefined' || list === null || list.length === 0) {
            errs2.push(invalidOptionsListInCombine({list, arg, option: options[i]}))
          } else {
            for (let k = 0; k < list.length; k++) {
              const argument = list[k]
              if (!(Array.isArray(argument.types) || argument.types === null)) {
                errs2.push(invalidTypesInArgument({types: argument.types, argument}))
              } else {
                if (typeof args2[arg] === 'undefined') args2[arg] = []
                args2[arg].push(argument)
              }
            }
          }
        } else {
          const ref   = args2[arg][0]
          const types = ref.types
          for (let k = 0; k < list.length; k++) {
            const argument = list[k]
            if (!(Array.isArray(argument.types) || argument.types === null)) {
              errs2.push(invalidTypesInArgument({types: argument.types, argument}))
            } else if ((argument.types || []).length === (types || []).length) {
              args2[arg].push(argument)
            } else {
              errs2.push(nonMatchingArgumentTypes({arg, ref, argument}))
            }
          }
        }
      }
    }
  }

  return {errs: errs2, args: args2}
}

function invalidTypesInArgument ({types, argument}) {
  return {
    code: 'Invalid types in argument',
    msg:  'Each argument must have a types key that must be null or an array',
    info: {types, argument}
  }
}

function nonMatchingArgumentTypes ({arg, ref, argument}) {
  return {
    code: 'Non-matching argument types',
    msg:  'If arguments have the same arg, their types must either be equal or have the same length',
    info: {arg, ref, argument}
  }
}

function invalidOptionsListInCombine ({list, arg, option}) {
  return {
    code: 'Invalid options list in combine',
    msg:  'Options list in combine was undefined, null or empty',
    info: {list, arg, option}
  }
}