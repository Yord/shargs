const illegalKeyName = ({key, option}) => ({
  code: 'Illegal key name',
  msg:  'An option key had an illegal name.',
  info: {key, option}
})

const invalidDefaultValues = ({defaultValues, option}) => ({
  code: 'Invalid default values',
  msg:  "An option's defaultValues field has an invalid type. It must be an array with any values in it.",
  info: {defaultValues, option}
})

const invalidOptionsListInCombine = ({options, arg, argument}) => ({
  code: 'Invalid options list in combine',
  msg:  'Options list in combine was undefined, null or empty',
  info: {options, arg, argument}
})

const invalidRequiredPositionalArgument = ({positionalArguments}) => ({
  code: 'Invalid required positional argument',
  msg:  'If a positional argument is required, all previous positional arguments must be required as well. The required field must either be undefined, true or false.',
  info: {positionalArguments}
})

const invalidTypes = ({types, option}) => ({
  code: 'Invalid types',
  msg:  'Each argument must have a types key that must be null or an array',
  info: {types, option}
})

const invalidVariadicPositionalArgument = ({positionalArguments}) => ({
  code: 'Invalid variadic positional argument',
  msg:  'Only the last positional argument may be variadic. The variadic field must either be undefined, true or false.',
  info: {positionalArguments}
})

const nonMatchingArgumentTypes = ({arg, ref, option}) => ({
  code: 'Non-matching argument types',
  msg:  'If arguments have the same arg, their types must either be equal or have the same length',
  info: {arg, ref, option}
})

const requiredPositionalArgumentMissing = ({key, positionalArgument}) => ({
  code: 'Required positional argument missing',
  msg:  'A required positional argument has not been provided.',
  info: {key, positionalArgument}
})

module.exports = {
  illegalKeyName,
  invalidDefaultValues,
  invalidOptionsListInCombine,
  invalidRequiredPositionalArgument,
  invalidTypes,
  invalidVariadicPositionalArgument,
  nonMatchingArgumentTypes,
  requiredPositionalArgumentMissing
}