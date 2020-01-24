module.exports = {
  invalidTypesInArgument,
  nonMatchingArgumentTypes,
  invalidOptionsListInCombine
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