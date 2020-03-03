const optsFilter = p => usageFunction => (opts = []) => (
  usageFunction(opts.filter(p))
)

const optsMap = f => usageFunction => (opts = []) => (
  usageFunction(opts.map(f))
)

const decorate = (f, ...fs) => usageFunction => (
  [f, ...fs].reduce((uf, f) => f(uf), usageFunction)
)

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
  decorate,
  justArgs,
  noCommands,
  onlyCommands,
  onlyFirstArg,
  optsFilter,
  optsMap
}