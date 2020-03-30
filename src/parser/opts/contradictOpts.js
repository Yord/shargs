const {contradictionDetected, wrongContradictsType} = require('../../errors')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {key, contradicts: keys} = opt

    if (typeof keys !== 'undefined' && willHaveValues(opt)) {
      if (Array.isArray(keys)) {
        if (opts.some(opt2 => keys.indexOf(opt2.key) > -1 && willHaveValues(opt2))) {
          errs2.push(contradictionDetected({key, contradicts: keys, option: opt}))
        }
      } else {
        errs2.push(wrongContradictsType({key, type: typeof keys, option: opt}))
      }
    }
  }

  return {errs: errs.concat(errs2), opts}
}

function willHaveValues ({values, defaultValues}) {
  return typeof values !== 'undefined' || typeof defaultValues !== 'undefined'
}