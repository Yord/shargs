module.exports = parsers => ({errs = [], opts = []} = {}) => {
  const {errs: errs2, args: args2} = convertNonCommands({opts})
  const {errs: errs3, args: args3} = convertCommands(parsers)({opts})
  const {errs: errs4, args: args4} = setDefaultValues({opts})

  return {
    errs: errs.concat(errs2).concat(errs3).concat(errs4),
    args: {
      ...args4,
      ...args2,
      ...args3,
      _: [...args2._, ...args3._]
    }
  }
}

function convertNonCommands ({errs = [], opts: OPTS = []} = {}) {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const {key, values, types} = OPTS[i]

    if (Array.isArray(values) && types !== null) {
      if (typeof types === 'undefined') {
        if (values.length !== 1 || values[0] !== '--') args['_'] = args['_'].concat(values)
      } else if (Array.isArray(types) && types.length === 0) {
        args[key] = {
          type: 'flag',
          count: values.length === 0 ? 1 : typeof args[key] === 'undefined' ? values[0] : args[key].count + values[0]
        }
      } else {
        args[key] = types.length === 1 ? values[0] : values
      }
    }
  }

  return {errs: errs.concat(errs2), args}
}

function convertCommands (parsers) {
  return ({errs = [], opts: OPTS = []} = {}) => {
    let args  = {_: []}
    let errs2 = []
  
    for (let i = 0; i < OPTS.length; i++) {
      const {key, values, types, opts} = OPTS[i]
  
      if (Array.isArray(values) && types === null) {
        const parentParser = parsers.__
        const childParser  = typeof parsers[key] === 'function' ? parsers[key] : parsers._
  
        const child = childParser(opts || [])(values, [])
        errs2       = errs2.concat(child.errs || [])
        args[key]   = Object.assign({}, args[key], child.args)
  
        if (typeof parentParser === 'function') {
          const parent = parentParser(filter(OPTS))(child.args._, [])
          errs2        = errs2.concat(parent.errs || [])
          args         = {...parent.args, ...args, _: args._.concat(parent.args._)}
        }
      }
    }
  
    return {errs: errs.concat(errs2), args}
  }
}

function setDefaultValues ({errs = [], opts: OPTS = []} = {}) {
  let args  = {_: []}
  let errs2 = []

  for (let i = 0; i < OPTS.length; i++) {
    const {key, types, values, defaultValues} = OPTS[i]

    if (typeof values === 'undefined' && Array.isArray(defaultValues)) {
      args[key] = Array.isArray(types) && types.length === 1 ? defaultValues[0] : defaultValues
    }
  }

  return {errs: errs.concat(errs2), args}
}

function filter (opts) {
  return opts.filter(opt => isNoCommand(opt) && isNotRest(opt) && hasNoValues(opt))
}

function isNoCommand ({types}) {
  return types !== null
}

function isNotRest ({types}) {
  return typeof types !== 'undefined'
}

function hasNoValues ({values}) {
  return typeof values === 'undefined'
}