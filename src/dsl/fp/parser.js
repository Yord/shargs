const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')

module.exports = ({argv = [], toOpts, opts = [], toArgs, args = []}) => OPTS => {
  const {errs: combineErrors = [], args: ARGS} = combine(...OPTS.map(option))

  return pipe(
    ({errs = [], argv = []}) => ({errs: errs.concat(combineErrors), argv}),
    ...argv,
    toOpts(ARGS),
    ...opts,
    toArgs,
    ...args
  )
}