const {
  CommandExpected,
  InvalidArgs,
  InvalidKey,
  InvalidNestedCommand,
  InvalidOpts,
  InvalidTypes,
  OptionExpected,
  PosArgExpected,
  SubcommandExpected,
  UnknownCommandLineOptionType
} = require('./errors')

function verifyCommand (opt) {
  const err = CommandExpected({opt})

  if (isCommand(opt)) {
    const errs = []

    if (invalidKey(opt))  errs.push(InvalidKey({opt}))
    if (invalidOpts(opt)) errs.push(InvalidOpts({opt}))

    const {errs: errs2, opts} = verifyOpts({errs, opts: [opt]})

    if (errs.length > 0) {
      return {errs: [err, ...errs]}
    } else if (errs2.length > 0) {
      return {
        errs: errs2,
        opt: {...opt, opts}
      }
    } else {
      return {errs: [], opt}
    }
  } else {
    return {errs: [err]}
  }
}

module.exports = {
  verifyCommand
}

function verifyOpts ({errs, opts}) {
  const [opt] = opts
  const {opts: opts2} = opt

  if (!Array.isArray(opts2)) {
    return {errs: [...errs, InvalidOpts({opt})], opts: []}
  } else {
    return opts2.map(verifyOpt).reduce(
      ({errs, opts}, {errs: errs2, opts: opts2}) => ({
        errs: [...errs, ...errs2],
        opts: [...opts, ...opts2]
      }),
      {errs, opts: []}
    )
  }
}

function verifyOpt (opt) {
  switch (true) {
    case isOption(opt):     return verifyOption(opt)
    case isPosArg(opt):     return verifyPosArg(opt)
    case isSubcommand(opt): return verifySubcommand(opt)
    case isCommand(opt):    return {errs: [InvalidNestedCommand({opt})],         opts: []}
    default:                return {errs: [UnknownCommandLineOptionType({opt})], opts: []}
  }
}

function verifyOption (opt) {
  const errs = []

  if (invalidKey(opt))   errs.push(InvalidKey({opt}))
  if (invalidArgs(opt))  errs.push(InvalidArgs({opt}))
  if (invalidTypes(opt)) errs.push(InvalidTypes({opt}))

  return (
    errs.length > 0 ? {errs: [OptionExpected({opt}), ...errs], opts: []   }
                    : {errs: [],                               opts: [opt]}
  )
}

function verifyPosArg (opt) {
  const errs = []

  if (invalidTypes(opt)) errs.push(InvalidTypes({opt}))

  return (
    errs.length > 0 ? {errs: [PosArgExpected({opt}), ...errs], opts: []   }
                    : {errs: [],                               opts: [opt]}
  )
}

function verifySubcommand (opt) {
  const errs = []

  if (invalidArgs(opt)) errs.push(InvalidArgs({opt}))
  if (invalidOpts(opt)) errs.push(InvalidOpts({opt}))

  return (
    errs.length > 0 ? {errs: [SubcommandExpected({opt}), ...errs], opts: []   }
                    : {errs: [],                                   opts: [opt]}
  )
}

function invalidArgs ({args}) {
  return !Array.isArray(args) || args.length === 0 || args.some(arg => arg.includes(' '))
}

function invalidKey ({key}) {
  return typeof key !== 'string' || key === '_' || key === '--' || key.includes(' ')
}

function invalidOpts ({opts}) {
  return !Array.isArray(opts)
}

function invalidTypes ({types}) {
  return !Array.isArray(types) && typeof types !== 'undefined'
}

function isCommand (opt = {}) {
  return (
    [opt.key, opt.opts].every(isDefined) &&
    [opt.args, opt.types].every(isUndefined)
  )
}

function isSubcommand ({key, opts, args, types}) {
  return (
    [key, args, opts].every(isDefined) &&
    [types].every(isUndefined)
  )
}

function isOption ({key, args, opts}) {
  return (
    [key, args].every(isDefined) &&
    [opts].every(isUndefined)
  )
}

function isPosArg ({key, args, opts}) {
  return (
    [key].every(isDefined) &&
    [args, opts].every(isUndefined)
  )
}

function isDefined (val) {
  return typeof val !== 'undefined'
}

function isUndefined (val) {
  return typeof val === 'undefined'
}