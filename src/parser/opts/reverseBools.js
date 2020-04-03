const traverseOpts = require('./traverseOpts')

module.exports = traverseOpts(opt => hasReverse(opt) && isBool(opt) && hasValidValues(opt))(opt => {
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