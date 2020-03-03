const optsFilter = require('./optsFilter')
const optsMap = require('./optsMap')

const onlyCommands = optsFilter(
  ({types}) => typeof types === 'undefined' || types === null
)

const onlyFirstArg = optsMap(
  opt => ({...opt, args: (opt.args || []).slice(0, 1)})
)

module.exports = {
  onlyCommands,
  onlyFirstArg,
  optsMap
}