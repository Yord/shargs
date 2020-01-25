const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')

module.exports = opts => {
  const {errs: combineErrors = [], args} = combine(...opts.map(option))

  return (f, ...fs) => pipe(
    pipe(f(args), ...fs.map(f => f(args))),
    ({errs = [], argv = {}}) => ({errs: errs.concat(combineErrors), argv})
  )
}