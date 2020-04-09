const pipe    = require('./pipe')
const TO_ARGS = require('./toArgs')
const TO_OPTS = require('./toOpts')

module.exports = function parser (stages = {}, {checks = {}, parsers = {}} = {}) {
  const checksAndStages = {
    argv: [...(checks.argv || []), ...(stages.argv || [])],
    toOpts: stages.toOpts,
    opts: [...(checks.opts || []), ...(stages.opts || [])],
    toArgs: stages.toArgs,
    args: [...(checks.args || []), ...(stages.args || [])]
  }

  const {argv, toOpts = TO_OPTS, opts, toArgs, args} = checksAndStages

  return (OPTS = []) => (ARGV, ERRS) => pipe(
    ...argv,
    toOpts(OPTS),
    ...opts,
    toArgs || TO_ARGS({_: parser(stages), ...parsers, __: parser(stages)}),
    ...args
  )({errs: ERRS, argv: ARGV})
}