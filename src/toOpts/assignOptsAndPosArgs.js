const {pipe} = require('../pipe')

const assignOptsAndPosArgs = opt => ({errs, argv}) => {
  let opts = []

  let optStack = [opt]
  let at  = 0
  let arg = argv[at]

  while (arg) {
    const firstOptsFrom = firstWithOr([optStack, []], ([_, opts]) => opts.length > 0)

    const [optStack2, opts2] = firstOptsFrom([findOpts, findPosArg])(optStack, arg)

    optStack = optStack2

    if (opts2.length > 0) {
      const opt2 = opts2[0]

      if (isFlag(opt2)) {
        const values = [1]
        const opts3  = opts2.map(opt => ({...opt, values}))
        
        opts = mergeOptsUsingStack(opts, opts3, optStack)
        at   = at + 1
      } else if (isPrimitiveOrArray(opt2)) {
        if (isOption(opt2)) at = at + 1

        const length = opt2.types.length
        const values = argv.slice(at, at + length)

        if (values.length === length) {
          const opts3 = opts2.map(opt => ({...opt, values}))
          opts = mergeOptsUsingStack(opts, opts3, optStack)
        } else {
          const opts3 = [{values: [arg]}, ...values.map(value => ({values: [value]}))]
          opts = mergeOptsUsingStack(opts, opts3, optStack)
        }

        at = at + length
      } else if (isCommand(opt2)) {
        const values = []
        const opts3  = opts2.map(opt => ({...opt, values}))

        opts = mergeOptsUsingStack(opts, opts3, optStack)
        at   = at + 1
        optStack = [...optStack, opt2]
      } else if (isVariadic(opt2)) {
        if (isOption(opt2)) at = at + 1

        const values = []

        for (let at2 = at; at2 < argv.length; at2++) {
          const arg2 = argv[at2]

          if (arg2 === '--') break
          else values.push(arg2)
        }

        const types = Array.from({length: values.length}, () => 'string')
        const opts3 = opts2.map(opt => ({...opt, types, values}))
        opts = mergeOptsUsingStack(opts, opts3, optStack)
        at   = at + values.length
      } else {
        const opts3 = [{values: [arg]}]
        opts = mergeOptsUsingStack(opts, opts3, optStack)
        at = at + 1
      }
    } else {
      const opts3 = [{values: [arg]}]
      opts = mergeOptsUsingStack(opts, opts3, optStack)
      at = at + 1
      if (arg === '--') optStack = optStack.slice(0, 1)
    }

    arg = argv[at]
  }

  return {errs, opts}
}

module.exports = {
  assignOptsAndPosArgs
}

function mergeOptsUsingStack (opts, opts2, stack) {
  return mergeOpts(opts, opts2, stack.slice(1))
}

function mergeOpts (opts, opts2, stack) {
  const [cmd, ...tail] = stack

  let opts3 = undefined
  
  if (opts.length === 0) {
    opts3 = opts2
  } else {
    const opt = opts[opts.length - 1]
    if (typeof cmd !== 'undefined' && opt.key === cmd.key) {
      opts3 = [{
        ...opt,
        values: mergeOpts(opt.values, opts2, tail)
      }]
    } else {
      opts3 = [
        opt,
        ...opts2
      ]
    }
  }
  
  return [
    ...opts.slice(0, -1),
    ...opts3
  ]
}

function isPosArg ({args}) {
  return typeof args === 'undefined'
}

function isOption ({args}) {
  return typeof args !== 'undefined'
}

function isFlag ({types}) {
  return Array.isArray(types) && types.length === 0
}

function isPrimitiveOrArray ({types}) {
  return Array.isArray(types) && types.length > 0
}

function isCommand ({types, args, opts}) {
  return Array.isArray(args) && typeof types === 'undefined' && Array.isArray(opts)
}

function isVariadic ({key, types, opts}) {
  return typeof key === 'string' && typeof types === 'undefined' && typeof opts === 'undefined'
}

function firstWithOr (defaultRes, p) {
  return fs => (...params) => defaultTo(defaultRes)(firstWith(p)(fs)(...params))
}

function defaultTo (def) {
  return a => typeof a === 'undefined' ? def : a
}

function firstWith (p) {
  return fs => (...params) => {
    let res = undefined

    for (let i = 0; i < fs.length; i++) {
      const f = fs[i]

      const res2 = f(...params)

      if (p(res2)) {
        res = res2
        break
      }
    }

    return res
  }
}

function findPosArg (optStack, arg) {
  if (arg === '--') return [optStack, []]

  let posArgs   = []
  let optStack2 = optStack

  for (let i = optStack.length - 1; i >= 0; i--) {
    const opt = optStack[i]
    
    const posArgIndex = opt.opts.findIndex(isPosArg)

    if (posArgIndex > -1) {
      posArgs   = opt.opts.slice(posArgIndex, posArgIndex + 1)
      optStack2 = [
        ...optStack.slice(0, i - 2),
        {...opt, opts: [
          ...opt.opts.slice(0, posArgIndex),
          ...opt.opts.slice(posArgIndex + 1)
        ]}
      ]
      break
    }
  }

  return [optStack2, posArgs]
}

function findOpts (optStack, arg) {
  if (arg === '--') return [optStack, []]

  let opts      = []
  let optStack2 = optStack

  for (let i = optStack.length - 1; i >= 0; i--) {
    const opt = optStack[i]

    const opts2 = getOpts(arg, opt.opts)

    if (opts2.length > 0) {
      opts      = opts2
      optStack2 = optStack.slice(0, i + 1)
      break
    }
  }

  return [optStack2, opts]
}

function getOpts (arg, opts) {
  return pipe(filterOpts(arg), reduceOpts)(opts)
}

function filterOpts (arg) {
  return opts => opts.filter(({args = []}) => args.indexOf(arg) > -1)
}

function reduceOpts (opts) {
  if (opts.length === 0) return opts

  const cmd = opts.find(isCommand)
  if (typeof cmd !== 'undefined') return [cmd]

  const fst   = opts[0]
  const opts2 = opts.filter(
    ({types}) => typeof fst.types === 'undefined' ? typeof types === 'undefined' : types.length === fst.types.length
  )
  return opts2
}