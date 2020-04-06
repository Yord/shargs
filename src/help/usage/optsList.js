const {tableFrom} = require('../layout/table')

const optsListFrom = (id = 'cols') => (opts = []) => {
  const opts2 = opts.filter(opt => typeof opt === 'object')

  const argsByKey = opts2.reduce(
    (acc, opt) => ({
      ...acc,
      ...(typeof opt === 'undefined' || typeof opt.key === 'undefined'
          ? {}
          : {[opt.key]: [...(acc[opt.key] || []), ...(opt.args || [])]}
      )
    }),
    {}
  )

  return tableFrom(id)(
    flatMap(opt => {
      const {key, args, desc = ''} = opt
      if (typeof key === 'undefined') return []
      else return [[
        (Array.isArray(args) ? argsDef(opt) : posArg(opt)),
        desc + optDesc(opt, argsByKey)
      ]]
    })(opts2)
  )
}

const optsList = optsListFrom('cols')

module.exports = {
  optsList,
  optsListFrom
}

function argsDef (opt) {
  return sortArgs(opt.args).join(', ') + valuesLabel(opt)
}

function posArg ({key, variadic = false}) {
  return '<' + key + '>' + (variadic === true ? '...' : '')
}

function valuesLabel ({descArg = '', types, only = []}) {
  const value = (
    Array.isArray(only) && only.length > 0        ? only.join('|') :
    typeof descArg === 'string' && descArg !== '' ? descArg :
    Array.isArray(types)                          ?
    types.length === 1                            ? types[0] :
    types.length > 1                              ? types.join(' ')
                                                  : ''
                                                  : ''
  )

  return value === '' ? '' : '=<' + value + '>'
}

function optDesc ({contradicts = [], defaultValues = [], implies = [], required}, argsByKey) {
  const labels = [
    ...(Array.isArray(contradicts) && contradicts.length > 0
        ? ['contradicts: ' + flatMap(_ => argsByKey[_])(contradicts).join(', ')]
        : []
    ),
    ...(!Array.isArray(defaultValues)
        ? []
        : defaultValues.length === 0
          ? []
          : defaultValues.length === 1
            ? ['default: ' + defaultValues[0]]
            : ['default: ' + defaultValues.join(', ')]
    ),
    ...(Array.isArray(implies) && implies.length > 0
        ? ['implies: ' + flatMap(_ => argsByKey[_])(implies).join(', ')]
        : []
    ),
    ...(required === true
        ? ['required']
        : required === false
          ? ['not required']
          : []
    )
  ]

  return (labels.length === 0 ? '' : ' ') + labels.map(label => '[' + label + ']').join(' ')
}

function sortArgs (args) {
  const singleDash = []
  const doubleDash = []
  const others     = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--'))     doubleDash.push(arg)
    else if (arg.startsWith('-')) singleDash.push(arg)
    else                          others.push(arg)
  }

  return [...singleDash, ...others, ...doubleDash]
}

function flatMap (f) {
  return arr => arr.reduce((acc, val) => [...acc, ...f(val)], [])
}