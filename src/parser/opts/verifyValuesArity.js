const traverseOpts = require('./traverseOpts')
const {invalidArity, invalidTypes, invalidValues} = require('../errors')
const pipe = require('../combinators/pipe')

module.exports = pipe(
  checkArity('values'),
  checkArity('defaultValues')
)

function checkArity (key) {
  return traverseOpts(hasValues(key))(opt => {
    const errs = []

    const {types, [key]: values} = opt

    if (Array.isArray(values)) {
      if (Array.isArray(types)) {
        if (types.length === 0) {
          if (values.length !== 1) {
            errs.push(invalidArity({option: opt}))
          }
        } else {
          if(types.length !== values.length) {
            errs.push(invalidArity({option: opt}))
          }
        }
      } else if (typeof types === 'undefined') {
        if (values.length !== 1) {
          errs.push(invalidArity({option: opt}))
        }
      } else if (types !== null) {
        errs.push(invalidTypes({types, option: opt}))
      }
    } else {
      errs.push(invalidValues({[key]: values, option: opt}))
    }

    return {errs}
  })
}

function hasValues (key) {
  return ({[key]: values}) => typeof values !== 'undefined' && values !== null
}