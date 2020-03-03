const optsFilter = require('./optsFilter')
const optsMap = require('./optsMap')

const noCommands = optsFilter(
  ({types}) => typeof types !== 'undefined' && types !== null
)

const onlyCommands = optsFilter(
  ({types}) => typeof types === 'undefined' || types === null
)

const onlyFirstArg = optsMap(
  opt => ({...opt, args: (opt.args || []).slice(0, 1)})
)

module.exports = {
  noCommands,
  onlyCommands,
  onlyFirstArg,
  optsMap
}