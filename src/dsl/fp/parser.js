const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')

module.exports = opts => {
  const {errs: combineErrors = [], args} = combine(...opts.map(option))

  return (...fs) => pipe(
    ({errs = [], argv = []}) => ({errs: errs.concat(combineErrors), argv}),
    ...fs.map(f => f(args))
  )
}