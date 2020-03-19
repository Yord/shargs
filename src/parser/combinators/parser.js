const combine  = require('./combine')
const option   = require('./option')
const pipe     = require('./pipe')
const TO_ARGS  = require('../toArgs')
const TO_OPTS  = require('../toOpts')

module.exports = function parser (stages = {}) {
  const {argv = [], toOpts, opts = [], toArgs, args = []} = stages
  
  return (OPTS = []) => {
    const {errs: ERRS, args: ARGS} = combine(...OPTS.map(option))

    return (ARGV, ERRS2) => pipe(
      ({errs = [], argv = []}) => ({errs: errs.concat(ERRS), argv}),
      ...argv,
      typeof toOpts === 'function' ? toOpts(ARGS) : TO_OPTS(ARGS),
      ...opts,
      typeof toArgs === 'function' ? toArgs : TO_ARGS(parser(stages)),
      ...args
    )({errs: ERRS2, argv: ARGV})
  }
}