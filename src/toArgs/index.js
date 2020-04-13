const convertNonCommands = require('./convertNonCommands')
const convertCommands    = require('./convertCommands')
const setDefaultValues   = require('./setDefaultValues')

module.exports = parsers => ({errs = [], opts = []} = {}) => {
  const {errs: errs2, args: args2} = convertNonCommands({opts})
  const {errs: errs3, args: args3} = convertCommands(parsers)({opts})
  const {errs: errs4, args: args4} = setDefaultValues({opts})

  return {
    errs: errs.concat(errs2).concat(errs3).concat(errs4),
    args: {
      ...args4,
      ...args3,
      ...args2,
      _: [...args2._, ...args3._]
    }
  }
}