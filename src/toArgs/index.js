const {convertNonCommands} = require('./convertNonCommands')
const {convertCommands}    = require('./convertCommands')
const {setDefaultValues}   = require('./setDefaultValues')

const toArgs = (parsers, mode) => (mode === 'async' ? toArgsAsync : toArgsSync)(parsers)

module.exports = {
  toArgs
}

function toArgsAsync (parsers) {
  return ({errs = [], opts = []} = {}) => (
    Promise.all([
      convertNonCommands({opts}),
      convertCommands(parsers, 'async')({opts}),
      setDefaultValues({opts})
    ]).then(
      ([
        {errs: errs2, args: args2},
        {errs: errs3, args: args3},
        {errs: errs4, args: args4}
      ]) => ({
        errs: [...errs, ...errs2, ...errs3, ...errs4],
        args: {
          ...args4,
          ...args3,
          ...args2,
          _: [...args2._, ...args3._]
        }
      })
    )
  )
}

function toArgsSync (parsers) {
  return ({errs = [], opts = []} = {}) => {
    const {errs: errs2, args: args2} = convertNonCommands({errs, opts})
    const {errs: errs3, args: args3} = convertCommands(parsers, 'sync')({errs: errs2, opts})
    const {errs: errs4, args: args4} = setDefaultValues({errs: errs3, opts})
  
    return {
      errs: errs4,
      args: {
        ...args4,
        ...args3,
        ...args2,
        _: [...args2._, ...args3._]
      }
    }
  }
}