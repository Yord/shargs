const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')

module.exports = ({argv = [], toOpts, opts = [], toArgs, args = []}) => opts2 => {
  const {errs: combineErrors = [], args: args2} = combine(...opts2.map(option))

  return pipe(
    ({errs = [], argv = []}) => ({errs: errs.concat(combineErrors), argv}),
    ...argv,
    toOpts(args2),
    ...opts,
    toArgs,
    ...args
  )
}