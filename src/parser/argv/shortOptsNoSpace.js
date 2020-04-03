const traverseArgv = require('./traverseArgv')

module.exports = traverseArgv(isShortOptionWithoutSpace)(arg => ({
  argv: [
    arg.slice(0, 2),
    arg.slice(2)
  ]
}))

function isShortOptionWithoutSpace (arg) {
  return arg.length > 2 && arg[0] === '-' && arg[1] !== '-'
}