const {pipe} = require('./pipe')
const {then} = require('./then')
const {toArgs: TO_ARGS} = require('./toArgs')
const {toOpts: TO_OPTS} = require('./toOpts')

function parser (stages = {}, options = {}) {
  const {checks = {}, parsers = {}, mode = 'sync'} = options

  const checksAndStages = {
    argv: [...(checks.argv || []), ...(stages.argv || [])],
    toOpts: stages.toOpts,
    opts: [...(checks.opts || []), ...(stages.opts || [])],
    toArgs: stages.toArgs,
    args: [...(checks.args || []), ...(stages.args || [])]
  }

  const {argv, toOpts = TO_OPTS, opts, toArgs, args} = checksAndStages

  return ({opts: OPTS = []} = {}) => (ARGV, ERRS) => (mode === 'async' ? then : pipe)(
    ...argv,
    toOpts(OPTS),
    ...opts,
    toArgs || TO_ARGS({_: parser(stages, {mode}), ...parsers, __: parser(stages, {mode})}, mode),
    ...args
  )({errs: ERRS, argv: ARGV})
}

module.exports = {
  parser
}