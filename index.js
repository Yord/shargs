const array   = types => (args, {only = null, opts = null, desc = ''} = {}) => ({types, args, only, opts, desc})

const number  = array(['number'])
const string  = array(['string'])
const bool    = array(['bool'])
const flag    = array([])
const command = array(null)



const commandOpts = option('foo', number(['--foo']))



const numStr  = array(['number', 'string'])

const chunker = option('chunker', number( ['--chunker', '-c'], {only: [42]}       ))
const applier = option('applier', string( ['--applier', '-a']                     ))
const str_int = option('numStr',  numStr( ['--num-str', '-n']                     ))
const verbose = option('verbose', flag(   ['--verbose', '-v']                     ))
const tru_fal = option('truFal',  bool(   ['--tru-fal', '-t']                     ))
const strlist = option('strlist', command(['--strlist', '-s']                     ))
const comm    = option('command', command(['command',       ], {opts: commandOpts}))
const noMinus = option('noMinus', string( ['noMinus'        ]                     ))



const aflag   = {
  //errs: [],
  args: {
    '--a-flag': {arg: 'aflag', types: []},
    '-f':       {arg: 'aflag', types: []}
  }
}



const options = [chunker, applier, str_int, verbose, aflag, tru_fal, strlist, comm, noMinus]
const {errs, args} = combine(options)
//console.log('args', args)



const argv = process.argv

function parser (args) {
  return pipe(
    splitShortOptions,
    parseArgs(args),
    mergeArgs
  )
}
console.log('parse', JSON.stringify(
  parser(args)(sliceArgv({errs, argv})),
  null,
  2
))



function sliceArgv ({errs = [], argv = []} = {}) {
  const errs2 = []
  let argv2   = []

  const minLength = 2

  if (argv.length < minLength) {
    const tooFewArguments = err(
      'Too few arguments',
      `The passed command line arguments must have at least ${minLength} items`,
      {argv}
    )
    errs2.push(tooFewArguments)
  } else {
    argv2 = argv.slice(2)
  }

  return {errs: errs.concat(errs2), argv: argv2}
}

function splitShortOptions ({errs = [], argv = []} = {}) {
  const errs2 = []
  const argv2 = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
      for (let at = 1; at < arg.length; at++) {
        const ch = arg[at]
        argv2.push('-' + ch)
      }
    } else {
      argv2.push(arg)
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}

function parseArgs (args = {}) {
  return ({errs = [], argv = []} = {}) => {
    let errs2   = []
    const argv2 = []

    let at  = 0
    let arg = argv[at]

    while (arg) {
      const option = args[arg]
      if (option) {
        const {arg, only, opts} = option
        let   {types} = option

        let arr = []
        if (typeof types === 'undefined' || types === null) {
          let i = at + 1
          let arg2 = argv[i] || '--'
          while (arg2 !== '--') {
            if (types === null) types = []
            types.push('string')
            arr.push(arg2)
            i++
            arg2 = argv[i] || '--'
          }
        } else {
          arr = argv.slice(at + 1, at + types.length + 1)
        }

        const res = pipe(
          cast(types),
          validate(only)
        )({errs, argv: arr})

        errs2 = errs2.concat(res.errs)
        argv2.push([arg, res.argv, option.types, opts])

        at += types.length + 1
      } else {
        const arr = argv.slice(at, at + 1)
        if (arr.length > 0) argv2.push(arr)
        at++
      }

      arg = argv[at]
    }

    return {errs: errs.concat(errs2), argv: argv2}
  }
}

// TODO: Error Handling
function cast (types) {
  return ({errs = [], argv = []} = {}) => {
    const errs2 = []
    const argv2 = []
    
    if (types.length === 0) {
      argv2.push(true)
    } else {
      for (let i = 0; i < types.length; i++) {
        const type = types[i]
        switch (type) {
          case 'count':   argv2.push(1);                   break
          case 'string':  argv2.push(argv[i]);             break
          case 'number':  argv2.push(parseFloat(argv[i])); break // THIS MAY FAIL!
          case 'bool':
            if (argv[i] === 'true')       argv2.push(true)
            else if (argv[i] === 'false') argv2.push(false)
            else throw new Error('FAIL');                  break // THIS MAY FAIL!
          default:                                         break
        }
      }
    }
  
    return {errs: errs.concat(errs2), argv: argv2}
  }
}

// TODO: Implementation
function validate (only) {
  return ({errs = [], argv = []} = {}) => ({errs, argv})
}

// TODO: Error Handling
function mergeArgs ({errs = [], argv = []} = {}) {
  let errs2   = []
  const argv2 = {_: []}

  for (let i = 0; i < argv.length; i++) {
    const [arg, params, types, opts] = argv[i]

    if (typeof types === 'undefined') {
      if (arg !== '--') {
        argv2['_'].push(arg)
      }
    } else if (types === null) {
      const {errs: errs3 = [], args = {}} = opts || {}

      errs2 = errs2.concat(errs3)

      const parse = parser(args)
      const {errs: errs4, argv} = parse({errs: [], argv: params})

      errs2 = errs2.concat(errs4)

      argv2[arg] = Object.assign({}, argv2[arg], argv)
    } else if (types.length === 0) {
      argv2[arg] = typeof argv2[arg] === 'undefined' ? true : argv2[arg] < 2 ? 2 : argv2[arg] + 1
    } else {
      argv2[arg] = types.length === 1 ? params[0] : params
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}





// TODO: Error Messages
function option (arg, {args = [], types = null, only = [], opts = null, desc = ''} = {}) {
  const errs  = []
  const args2 = {}

  if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      const key  = args[i]
      args2[key] = {arg, types, only, opts, desc}
    }
  } else {
    errs.push({msg: 'BAD OPTION!'})
  }

  return {errs, args: args2}
}

// TODO: Error Handling
function combine (options) {
  let errs2   = []
  const args2 = {}

  for (let i = 0; i < options.length; i++) {
    const {errs = [], args} = options[i]

    if (errs.length > 0) {
      errs2 = errs2.concat(errs)
    } else {
      const keys = Object.keys(args)

      for (let i = 0; i < keys.length; i++) {
        const key   = keys[i]
        const value = args[key]
        args2[key]  = value
      }
    }
  }

  return {errs: errs2, args: args2}
}

function pipe (f1, ...fs) {
  return a => {
    let res = f1(a)

    for (let i = 0; i < fs.length; i++) {
      const f = fs[i]
      res = f(res)
    }

    return res
  }
}