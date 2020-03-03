const optsFilter = require('./optsFilter')
const optsMap = require('./optsMap')

const justArgs = list => optsFilter(
  ({args}) => list.some(cmd => args.includes(cmd))
)

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
  justArgs,
  noCommands,
  onlyCommands,
  onlyFirstArg,
  optsMap
}