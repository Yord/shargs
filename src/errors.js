const illegalKeyName = ({key, option}) => ({
  code: 'IllegalKeyName',
  msg:  'An option key had an illegal name.',
  info: {key, option}
})

const invalidDefaultValues = ({defaultValues, option}) => ({
  code: 'InvalidDefaultValues',
  msg:  "An option's defaultValues field has an invalid type. It must be an array with any values in it.",
  info: {defaultValues, option}
})

const invalidOptionsListInCombine = ({options, arg, argument}) => ({
  code: 'InvalidOptionsListInCombine',
  msg:  'Options list in combine was undefined, null or empty',
  info: {options, arg, argument}
})

const invalidTypes = ({types, option}) => ({
  code: 'InvalidTypes',
  msg:  'Each argument must have a types key that must be null or an array',
  info: {types, option}
})

const nonMatchingArgumentTypes = ({arg, ref, option}) => ({
  code: 'NonMatchingArgumentTypes',
  msg:  'If arguments have the same arg, their types must either be equal or have the same length',
  info: {arg, ref, option}
})

module.exports = {
  illegalKeyName,
  invalidDefaultValues,
  invalidOptionsListInCombine,
  invalidTypes,
  nonMatchingArgumentTypes
}