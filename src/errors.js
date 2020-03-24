const argumentIsNotABool = ({option, value}) => ({
  code: 'Argument is not a boolean',
  msg:  "The passed command line argument must either be 'true' or 'false'",
  info: {value, option}
})

const argumentIsNotANumber = ({option, value}) => ({
  code: 'Argument is not a number',
  msg:  'The passed command line argument must be a number',
  info: {value, option}
})

const argumentValueRestrictionsViolated = ({value, only, option}) => ({
  code: 'Argument value restrictions violated',
  msg:  'The argument is not in the allowed set of values',
  info: {value, only, option}
})

const invalidOptionsListInCombine = ({options, arg, argument}) => ({
  code: 'Invalid options list in combine',
  msg:  'Options list in combine was undefined, null or empty',
  info: {options, arg, argument}
})

const invalidTypesInArgument = ({types, option}) =>({
  code: 'Invalid types in argument',
  msg:  'Each argument must have a types key that must be null or an array',
  info: {types, option}
})

const noArgumentsProvidedInOption = ({option}) => ({
  code: 'No arguments provided in option',
  msg:  "Please provide at least one argument (e.g. [{args: ['--foo'], ...}])",
  info: {option}
})

const noKeyProvidedInOption = ({option}) => ({
  code: 'No key provided in option',
  msg:  "Please provide a key (e.g. [{key: 'foo', ...}])",
  info: {option}
})

const nonMatchingArgumentTypes = ({arg, ref, option}) => ({
  code: 'Non-matching argument types',
  msg:  'If arguments have the same arg, their types must either be equal or have the same length',
  info: {arg, ref, option}
})

const requiredOptionFormat = ({key, values, option}) => ({
  code: 'Wrong format for required option',
  msg:  'A required option has values in the wrong format. It should be an array of values.',
  info: {key, values, option}
})

const requiredOptionMissing = ({key, args, option}) => ({
  code: 'Required option is missing',
  msg:  'An option that is marked as required has not been provided.',
  info: {key, args, option}
})

const unexpectedArgument = ({argument}) => ({
  code: 'Unexpected argument',
  msg:  'An unexpected argument was used that has no option defined.',
  info: {argument}
})

module.exports = {
  argumentIsNotABool,
  argumentIsNotANumber,
  argumentValueRestrictionsViolated,
  invalidOptionsListInCombine,
  invalidTypesInArgument,
  noKeyProvidedInOption,
  noArgumentsProvidedInOption,
  nonMatchingArgumentTypes,
  requiredOptionFormat,
  requiredOptionMissing,
  unexpectedArgument
}