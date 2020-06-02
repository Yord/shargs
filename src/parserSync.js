const {fromArgs: FROM_ARGS} = require('./fromArgs')
const {pipe}                = require('./pipe')
const {toArgs:   TO_ARGS}   = require('./toArgs')
const {toArgv:   TO_ARGV}   = require('./toArgv')
const {toOpts:   TO_OPTS}   = require('./toOpts')

const Sync = {
  resolve: a => a,
  then: pipe,
  all: a => a
}

const parserSync = (stages = {}, substages = {}) => {
  const {
    toArgv   = TO_ARGV,
    argv     = [],
    toOpts   = TO_OPTS,
    opts     = [],
    toArgs   = TO_ARGS,
    args     = [],
    fromArgs = FROM_ARGS
  } = stages

  return opt => (any, errs = []) => Sync.then(
    toArgv,
    ...argv,
    toOpts(opt),
    recurseOpts(opts, substages),
    toArgs,
    transformArgs(args),
    fromArgs
  )({errs, any})
}

module.exports = {
  parserSync
}

function recurseOpts (optsStages, substages) {
  return ({errs = [], opts = []} = {errs: [], opts: []}) => {
    const promise1 = Sync.then(...optsStages)({errs, opts})
    
    return Sync.then(result => {
      const {errs: errs3 = [], opts: opts3 = []} = result || {errs, opts: []}

      const promises = opts3.map(opt => {
        if (isSubcommand(opt)) {
          const stages = (
            Array.isArray(substages[opt.key]) ? substages[opt.key] :
            Array.isArray(substages._)        ? substages._
                                              : optsStages
          )
          const substages2 = substages[opt.key] || {}
  
          const promise2 = recurseOpts(stages, substages2)({errs: [], opts: opt.values})
          
          return Sync.then(({errs: errs4, opts: opts4}) => {
            return {
              errs: errs4,
              opts: [{...opt, values: opts4}]
            }
          })(promise2)
        } else {
          return Sync.resolve({
            errs: [],
            opts: [opt]
          })
        }
      })

      return Sync.then(results => {
        return results.reduce(
          ({errs, opts}, {errs: errs2, opts: opts2}) => ({
            errs: [...errs, ...errs2],
            opts: [...opts, ...opts2],
          }),
          {errs: errs3, opts: []}
        )
      })(Sync.all(promises))
    })(promise1)
  }
}

function transformArgs (argsStages) {
  return ({errs = [], args = []} = {errs: [], args: []}) => {
    const promises = args.map(arg => {
      return Sync.then(...argsStages)({errs: [], args: arg})
    })

    return Sync.then(results => {
      return results.reduce(
        ({errs, args}, {errs: errs2, args: args2}) => ({
          errs: [...errs, ...errs2],
          args: [...args, args2]
        }),
        {errs, args: []}
      )
    })(Sync.all(promises))
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