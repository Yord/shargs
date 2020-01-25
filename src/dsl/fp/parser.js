const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')

module.exports = ({argv = [], toOpts, opts = [], toArgs, results = []}) => opts2 => {
  const {errs: combineErrors = [], args} = combine(...opts2.map(option))

  return pipe(
    ({errs = [], argv = []}) => ({errs: errs.concat(combineErrors), argv}),
    ...argv,
    toOpts(args),
    ...opts,
    toArgs,
    ...results
  )
}