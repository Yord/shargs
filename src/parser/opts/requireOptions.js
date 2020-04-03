const transformOpts = require('./transformOpts')
const {requiredOptionFormat, requiredOptionMissing} = require('../../errors')

module.exports = transformOpts(isRequired)(opt => {
  const errs = []

  const {key, args, values} = opt

  if (values === null || typeof values === 'undefined') {
    errs.push(requiredOptionMissing({key, args, option: opt}))
  } else if (!Array.isArray(values)) {
    errs.push(requiredOptionFormat({key, values, option: opt}))
  }

  return {errs}
})

function isRequired ({required}) {
  return required === true
}