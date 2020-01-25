const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')

module.exports = ({argv = [], toOptions, options = [], toResults, results = []}) => opts => {
  const {errs: combineErrors = [], args} = combine(...opts.map(option))

  return pipe(
    ({errs = [], argv = []}) => ({errs: errs.concat(combineErrors), argv}),
    ...argv,
    toOptions(args),
    ...options,
    toResults,
    ...results
  )
}