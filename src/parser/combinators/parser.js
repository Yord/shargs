const pipe     = require('./pipe')
const TO_ARGS  = require('../toArgs')
const TO_OPTS  = require('../toOpts')

module.exports = function parser (stages = {}) {
  const {argv = [], toOpts = TO_OPTS, opts = [], toArgs, args = []} = stages
  return (OPTS = []) => (ARGV, ERRS) => pipe(
    ...argv,
    toOpts(OPTS),
    ...opts,
    toArgs || TO_ARGS(parser(stages)),
    ...args
  )({errs: ERRS, argv: ARGV})
}