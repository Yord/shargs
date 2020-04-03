const traverseOpts = require('./traverseOpts')
const and = require('../combinators/and')

module.exports = traverseOpts(and(hasReverse, isFlag, hasValidValues))(opt => ({
  opts: [
    {...opt, values: [-opt.values[0]]}
  ]
}))

function hasReverse ({reverse}) {
  return reverse === true
}

function isFlag ({types}) {
  return Array.isArray(types) && types.length === 0
}

function hasValidValues ({values}) {
  return Array.isArray(values) && values.length === 1
}