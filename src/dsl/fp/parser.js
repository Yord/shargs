const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')

module.exports = ({preprocessing = [], toOptions, processing = [], toResults, postprocessing = []}) => opts => {
  const {errs: combineErrors = [], args} = combine(...opts.map(option))

  return pipe(
    ({errs = [], argv = []}) => ({errs: errs.concat(combineErrors), argv}),
    ...preprocessing,
    toOptions(args),
    ...processing,
    toResults,
    ...postprocessing
  )
}