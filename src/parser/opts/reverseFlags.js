const transformOpts = require('./transformOpts')

module.exports = transformOpts(opt => hasReverse(opt) && isFlag(opt) && hasValidValues(opt))(opt => ({
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