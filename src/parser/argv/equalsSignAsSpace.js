const traverseArgv = require('./traverseArgv')

module.exports = traverseArgv(hasEqualsSign)(arg => ({
  argv: [
    arg.slice(0, arg.indexOf('=')),
    arg.slice(arg.indexOf('=') + 1)
  ]
}))

function hasEqualsSign (arg) {
  return arg.indexOf('=') > -1
}