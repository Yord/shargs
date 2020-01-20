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
        const key  = keys[j]
        const list = args[key]
        if (typeof args2[key] === 'undefined') {
          if (typeof list !== 'undefined' && list !== null && list.length > 0) {
            args2[key] = list
          } else {
            args2[key] = []
            errs2.push({
              code: 'Invalid options list in combine',
              msg:  'Options list in combine was undefined, null or empty',
              info: {list}
            })
          }
        } else {
          const ref   = args2[key][0]
          const types = ref.types || []
          for (let k = 0; k < list.length; k++) {
            const argument = list[k]
            if (argument.types !== null && !Array.isArray(argument.types)) {
              errs2.push({
                code: 'Invalid types in argument',
                msg:  'Each argument must have a types key that must be null or an array',
                info: {argument}
              })
            } else if (argument.types === types || argument.types.length === types.length) {
              args2[key].push(argument)
            } else {
              errs2.push({
                code: 'Non-matching argument types',
                msg:  'If arguments have the same key, their types must either be equal or have the same length',
                info: {key, ref, argument}
              })
            }
          }
        }
      }
    }
  }

  return {errs: errs2, args: args2}
}