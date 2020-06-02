const {fromArgs: FROM_ARGS} = require('./fromArgs')
const {pipe}                = require('./pipe')
const {then}                = require('./then')
const {toArgs:   TO_ARGS}   = require('./toArgs')
const {toArgv:   TO_ARGV}   = require('./toArgv')
const {toOpts:   TO_OPTS}   = require('./toOpts')

const Sync = {
  resolve: a => a,
  then:    pipe,
  all:     a => a
}

const Async = {
  resolve: a => Promise.resolve(a),
  then:    then,
  all:     a => Promise.all(a)
}

module.exports = {
  parser:     parser(Async),
  parserSync: parser(Sync)
}

function parser (Mode) {
  return (stages = {}, substages = {}) => {
    const {
      toArgv   = TO_ARGV,
      argv     = [],
      toOpts   = TO_OPTS,
      opts     = [],
      toArgs   = TO_ARGS,
      args     = [],
      fromArgs = FROM_ARGS
    } = stages
  
    return opt => (any, errs = []) => Mode.then(
      toArgv,
      ...argv,
      toOpts(opt),
      recurseOpts(Mode)(opts, substages),
      toArgs,
      transformArgs(Mode)(args),
      fromArgs
    )({errs, any})
  }
}

function recurseOpts (Mode) {
  return (optsStages, substages) => ({errs = [], opts = []} = {errs: [], opts: []}) => {
    const promise1 = Mode.then(...optsStages)({errs, opts})
    
    return Mode.then(result => {
      const {errs: errs3 = [], opts: opts3 = []} = result || {errs, opts: []}

      const promises = opts3.map(opt => {
        if (isSubcommand(opt)) {
          const stages = (
            Array.isArray(substages[opt.key]) ? substages[opt.key] :
            Array.isArray(substages._)        ? substages._
                                              : optsStages
          )
          const substages2 = substages[opt.key] || {}
  
          const promise2 = recurseOpts(Mode)(stages, substages2)({errs: [], opts: opt.values})
          
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

function isSubcommand ({key, args, types, opts}) {
  return (
    typeof key === 'string' &&
    Array.isArray(args) && args.length > 0 &&
    typeof types === 'undefined' &&
    Array.isArray(opts)
  )
}