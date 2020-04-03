const traverseOpts = require('./traverseOpts')
const and = require('../combinators/and')

module.exports = traverseOpts(and(hasReverse, isBool, hasValidValues))(opt => {
  const val   = opt.values[0]
  const value = val === 'false' ? 'true' : val === 'true' ? 'false' : typeof val === 'boolean' ? !val : val

  return {opts: [{...opt, values: [value]}]}
})

function hasReverse ({reverse}) {
  return reverse === true
}

function isBool ({types}) {
  return Array.isArray(types) && types.length > 0 && types[0] === 'bool'
}

function hasValidValues ({values}) {
  return Array.isArray(values) && values.length === 1
}