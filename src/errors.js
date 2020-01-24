module.exports = {
  argumentIsNotABool,
  argumentIsNotANumber,
  argumentValueRestrictionsViolated,
  invalidOptionsListInCombine,
  invalidTypesInArgument,
  noArgumentProvidedInOption,
  noArgumentsProvidedInOption,
  nonMatchingArgumentTypes
}

function argumentIsNotABool ({option, arg}) {
  return {
    code: 'Argument is not a boolean',
    msg:  "The passed command line argument must either be 'true' or 'false'",
    info: {option, arg}
  }
}

function argumentIsNotANumber ({option, arg}) {
  return {
    code: 'Argument is not a number',
    msg:  'The passed command line argument must be a number',
    info: {option, arg}
  }
}

function argumentValueRestrictionsViolated ({arg, only}) {
  return {
    code: 'Argument value restrictions violated',
    msg:  'The argument is not in the allowed set of values',
    info: {arg, only}
  }
}

function invalidTypesInArgument ({types, argument}) {
  return {
    code: 'Invalid types in argument',
    msg:  'Each argument must have a types key that must be null or an array',
    info: {types, argument}
  }
}

function nonMatchingArgumentTypes ({arg, ref, argument}) {
  return {
    code: 'Non-matching argument types',
    msg:  'If arguments have the same arg, their types must either be equal or have the same length',
    info: {arg, ref, argument}
  }
}

function invalidOptionsListInCombine ({list, arg, option}) {
  return {
    code: 'Invalid options list in combine',
    msg:  'Options list in combine was undefined, null or empty',
    info: {list, arg, option}
  }
}

function noArgumentProvidedInOption ({options}) {
  return {
    code: 'No argument provided in option',
    msg:  "Please provide a key (e.g. [{key: 'foo', ...}])",
    info: {options}
  }
}

function noArgumentsProvidedInOption ({options}) {
  return {
    code: 'No arguments provided in option',
    msg:  "Please provide at least one argument (e.g. [{args: ['--foo'], ...}])",
    info: {options}
  }
}