const optsMap = require('./optsMap')

const onlyFirstArg = optsMap(
  opt => ({...opt, args: (opt.args || []).slice(0, 1)})
)

module.exports = {
  onlyCommands,
  onlyFirstArg,
  optsMap
}