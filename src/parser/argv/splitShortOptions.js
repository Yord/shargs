const traverseArgv = require('./traverseArgv')

module.exports = traverseArgv(isArgvGroup)(arg => {
  const argv = []

  for (let at = 1; at < arg.length; at++) {
    const ch = arg[at]
    argv.push('-' + ch)
  }

  return {argv}
})

function isArgvGroup (arg) {
  return arg.length > 2 && arg[0] === '-' && arg[1] !== '-'
}