const {convertNonCommands} = require('./convertNonCommands')
const {convertCommands}    = require('./convertCommands')
const {setDefaultValues}   = require('./setDefaultValues')

const toArgs = parsers => ({errs = [], opts = []} = {}) => {
  const {errs: errs2, args: args2} = convertNonCommands({errs, opts})
  const {errs: errs3, args: args3} = convertCommands(parsers)({errs: errs2, opts})
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

module.exports = {
  toArgs
}