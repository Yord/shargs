const {pipe}                = require('./pipe')
const {toOpts:   TO_OPTS}   = require('./toOpts')
const {fromArgs: FROM_ARGS} = require('./fromArgs')
const {toArgs:   TO_ARGS}   = require('./toArgs')
const {toArgv:   TO_ARGV}   = require('./toArgv')

const parser = (stages = {}, substages = {}) => {
  const {
    toArgv   = TO_ARGV,
    argv     = [],
    toOpts   = TO_OPTS,
    opts     = [],
    toArgs   = TO_ARGS,
    args     = [],
    fromArgs = FROM_ARGS
  } = stages

  return opt => (any, errs = []) => pipe(
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
  parser
}

function recurseOpts (optsStages, substages) {
  return ({errs = [], opts = []} = {errs: [], opts: []}) => {
    let errs2   = []
    const opts2 = []

    const {errs: errs3 = [], opts: opts3 = []} = pipe(...optsStages)({errs: [], opts}) || {}
    errs2 = [...errs2, ...errs3]

    for (let i = 0; i < opts3.length; i++) {
      const opt = opts3[i]

      if (isSubcommand(opt)) {
        const stages = (
          Array.isArray(substages[opt.key]) ? substages[opt.key] :
          Array.isArray(substages._)        ? substages._
                                            : optsStages
        )
        const substages2 = substages[opt.key] || {}

        const {errs: errs4, opts: opts4} = recurseOpts(stages, substages2)({errs: [], opts: opt.values})
        
        errs2 = [...errs2, ...errs4]
        opts2.push({...opt, values: opts4})
      } else {
        opts2.push(opt)
      }
    }

    return {errs: [...errs, ...errs2], opts: opts2}
  }
}

function transformArgs (argsStages) {
  return ({errs = [], args = []} = {errs: [], args: []}) => {
    let errs2   = []
    const args2 = []

    for (let i = 0; i < args.length; i++) {
      const arg = args[i]

      const {errs: errs3, args: args3} = pipe(...argsStages)({errs: [], args: arg})

      errs2 = [...errs2, ...errs3]
      args2.push(args3)
    }

    return {errs: [...errs, ...errs2], args: args2}
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