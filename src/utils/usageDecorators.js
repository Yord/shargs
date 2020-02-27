const optsFilter = p => uf => (opts = []) => uf(opts.filter(p))

const optsMap = f => uf => (opts = []) => uf(opts.map(f))

const noCommands = optsFilter(
  ({types}) => typeof types !== 'undefined' && types !== null
)

const onlyFirstArg = optsMap(
  opt => ({...opt, args: (opt.args || []).slice(0, 1)})
)

module.exports = {
  noCommands,
  onlyFirstArg,
  optsFilter,
  optsMap
}