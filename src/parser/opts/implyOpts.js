const traverseOpts = require('./traverseOpts')
const {implicationViolated, wrongImpliesType} = require('../../errors')

module.exports = traverseOpts(opt => doesImply(opt) && willHaveValues(opt))((opt, _, opts) => {
  const errs = []

  const {key, implies: keys} = opt

  if (Array.isArray(keys)) {
    if (!opts.every(opt2 => keys.indexOf(opt2.key) === -1 || willHaveValues(opt2))) {
      errs.push(implicationViolated({key, implies: keys, option: opt}))
    }
  } else {
    errs.push(wrongImpliesType({key, type: typeof keys, option: opt}))
  }

  return {errs}
})

function doesImply ({implies}) {
  return typeof implies !== 'undefined'
}

function willHaveValues ({values, defaultValues}) {
  return typeof values !== 'undefined' || typeof defaultValues !== 'undefined'
}