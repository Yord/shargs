module.exports = {
  argumentIsNotABool: ({option, arg}) => ({
    code: 'Argument is not a boolean',
    msg:  "The passed command line argument must either be 'true' or 'false'",
    info: {option, arg}
  }),
  argumentIsNotANumber: ({option, arg}) => ({
    code: 'Argument is not a number',
    msg:  'The passed command line argument must be a number',
    info: {option, arg}
  }),
  argumentValueRestrictionsViolated: ({value, only, option}) => ({
    code: 'Argument value restrictions violated',
    msg:  'The argument is not in the allowed set of values',
    info: {value, only, option}
  }),
  invalidOptionsListInCombine: ({list, arg, option}) => ({
    code: 'Invalid options list in combine',
    msg:  'Options list in combine was undefined, null or empty',
    info: {list, arg, option}
  }),
  invalidTypesInArgument: ({types, argument}) =>({
    code: 'Invalid types in argument',
    msg:  'Each argument must have a types key that must be null or an array',
    info: {types, argument}
  }),
  noArgumentProvidedInOption: ({options}) => ({
    code: 'No argument provided in option',
    msg:  "Please provide a key (e.g. [{key: 'foo', ...}])",
    info: {options}
  }),
  noArgumentsProvidedInOption: ({options}) => ({
    code: 'No arguments provided in option',
    msg:  "Please provide at least one argument (e.g. [{args: ['--foo'], ...}])",
    info: {options}
  }),
  nonMatchingArgumentTypes: ({arg, ref, argument}) => ({
    code: 'Non-matching argument types',
    msg:  'If arguments have the same arg, their types must either be equal or have the same length',
    info: {arg, ref, argument}
  })
}