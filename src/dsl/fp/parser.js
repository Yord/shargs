const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')

module.exports = ({argv = [], toOpts, options = [], toResults, results = []}) => opts => {
  const {errs: combineErrors = [], args} = combine(...opts.map(option))

  return pipe(
    ({errs = [], argv = []}) => ({errs: errs.concat(combineErrors), argv}),
    ...argv,
    toOpts(args),
    ...options,
    toResults,
    ...results
  )
}