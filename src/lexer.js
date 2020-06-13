const {Async}           = require('./Async')
const {Sync}            = require('./Sync')
const {toArgv: TO_ARGV} = require('./toArgv')
const {toOpts: TO_OPTS} = require('./toOpts')

module.exports = {
  lexerF,
  lexer:     lexerF(Async),
  lexerSync: lexerF(Sync)
}

function lexerF (Mode) {
  return (stages = {}, substages = {}) => {
    const {
      toArgv = TO_ARGV,
      argv   = [],
      toOpts = TO_OPTS,
      opts   = []
    } = stages

    return opt => Mode.then(
      toArgv,
      ...argv,
      toOpts(opt),
      recurseOpts(Mode)(opts, substages)
    )
  }
}

function recurseOpts (Mode) {
  return (optsStages, substages, optsStages2) => ({errs = [], opts = []} = {errs: [], opts: []}) => {
    const stages = optsStages2 || optsStages

    const promise1 = Mode.then(...stages)({errs, opts})
    
    return Mode.then(result => {
      const {errs: errs3 = [], opts: opts3 = []} = result || {errs, opts: []}

      const promises = opts3.map(opt => {
        if (isSubcommand(opt) && hasValues(opt)) {
          const stages = (
            Array.isArray(substages[opt.key]) ? substages[opt.key] :
            Array.isArray(substages._)        ? substages._
                                              : undefined
          )
          const substages2 = substages[opt.key] || substages._ || {}
  
          const promise2 = recurseOpts(Mode)(optsStages, substages2, stages)({errs: [], opts: opt.values})
          
          return Mode.then(({errs: errs4, opts: opts4}) => {
            return {
              errs: errs4,
              opts: [{...opt, values: opts4}]
            }
          })(promise2)
        } else {
          return Mode.resolve({
            errs: [],
            opts: [opt]
          })
        }
      })

      return Mode.then(results => {
        return results.reduce(
          ({errs, opts}, {errs: errs2, opts: opts2}) => ({
            errs: [...errs, ...errs2],
            opts: [...opts, ...opts2],
          }),
          {errs: errs3, opts: []}
        )
      })(Mode.all(promises))
    })(promise1)
  }
}

function isSubcommand ({key, args, types, opts}) {
  return (
    typeof key === 'string' &&
    Array.isArray(args) && args.length > 0 &&
    typeof types === 'undefined' &&
    Array.isArray(opts)
  )
}

function hasValues ({values}) {
  return Array.isArray(values)
}