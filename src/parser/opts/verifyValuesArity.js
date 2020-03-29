const {invalidArity, invalidTypes, invalidValues} = require('../../errors')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = checkArity(opts, 'values')
  const errs3 = checkArity(opts, 'defaultValues')

  return {errs: errs.concat(errs2).concat(errs3), opts}
}

function checkArity (opts, key) {
  const errs2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {types, [key]: values} = opt

    if (Array.isArray(values)) {
      if (Array.isArray(types)) {
        if (types.length === 0) {
          if (values.length !== 1) {
            errs2.push(invalidArity({option: opt}))
          }
        } else {
          if(types.length !== values.length) {
            errs2.push(invalidArity({option: opt}))
          }
        }
      } else if (typeof types === 'undefined') {
        if (values.length !== 1) {
          errs2.push(invalidArity({option: opt}))
        }
      } else if (types !== null) {
        errs2.push(invalidTypes({types, option: opt}))
      }
    } else if (typeof values !== 'undefined' && values !== null) {
      errs2.push(invalidValues({[key]: values, option: opt}))
    }
  }

  return errs2
}