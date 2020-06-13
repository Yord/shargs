const {Async}               = require('./Async')
const {fromArgs: FROM_ARGS} = require('./fromArgs')
const {lexerF}              = require('./lexer')
const {toArgs:   TO_ARGS}   = require('./toArgs')
const {Sync}                = require('./Sync')

module.exports = {
  parserF,
  parser:     parserF(Async),
  parserSync: parserF(Sync)
}

function parserF (Mode) {
  return (stages = {}, substages = {}) => {
    const {
      toArgs   = TO_ARGS,
      args     = [],
      fromArgs = FROM_ARGS
    } = stages
  
    return opt => Mode.then(
      lexerF(Mode)(stages, substages)(opt),
      toArgs,
      transformArgs(Mode)(args),
      fromArgs
    )
  }
}

function transformArgs (Mode) {
  return (argsStages) => ({errs = [], args = []} = {errs: [], args: []}) => {
    const promises = args.map(arg => {
      return Mode.then(...argsStages)({errs: [], args: arg})
    })

    return Mode.then(results => {
      return results.reduce(
        ({errs, args}, {errs: errs2, args: args2}) => ({
          errs: [...errs, ...errs2],
          args: [...args, args2]
        }),
        {errs, args: []}
      )
    })(Mode.all(promises))
  }
}