const argumentIsNotABool = ({values, index, option}) => ({
  code: 'Argument is not a boolean',
  msg:  "The passed command line argument must either be 'true' or 'false'",
  info: {values, index, option}
})

const argumentIsNotANumber = ({values, index, option}) => ({
  code: 'Argument is not a number',
  msg:  'The passed command line argument must be a number',
  info: {values, index, option}
})

const commandRequired = ({options}) => ({
  code: 'Command required',
  msg:  'No command found. Please use at least one command!',
  info: {options}
})

const didYouMean = ({argv, options}) => ({
  code: 'Did you mean',
  msg:  'An unknown command-line argument was passed. Did you mean any of the following options?',
  info: {argv, options}
})

const falseArgsRules = ({rules, args}) => ({
  code: 'False args rules',
  msg:  'Your args rules returned false. Please abide to the rules defined in verifyArgs.',
  info: {rules, args}
})

const falseArgvRules = ({rules, argv}) => ({
  code: 'False argv rules',
  msg:  'Your argv rules returned false. Please abide to the rules defined in verifyArgv.',
  info: {rules, argv}
})

const falseOptsRules = ({rules, options}) => ({
  code: 'False opts rules',
  msg:  'Your opts rules returned false. Please abide to the rules defined in verifyOpts.',
  info: {rules, options}
})

const falseRules = ({key, rules, option}) => ({
  code: 'False rules',
  msg:  "An option's rules returned false. Please check your arguments.",
  info: {key, rules, option}
})

const invalidArity = ({option}) => ({
  code: 'Invalid arity',
  msg:  "An option's types arity does not match its values arity.",
  info: {option}
})

const invalidOptionsListInCombine = ({options, arg, argument}) => ({
  code: 'Invalid options list in combine',
  msg:  'Options list in combine was undefined, null or empty',
  info: {options, arg, argument}
})

const invalidTypes = ({types, option}) => ({
  code: 'Invalid types',
  msg:  'Each argument must have a types key that must be null or an array',
  info: {types, option}
})

const invalidValues = ({values, option}) => ({
  code: 'Invalid values',
  msg:  "An option's values field has an invalid type.",
  info: {values, option}
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

const valueRestrictionsViolated = ({key, values, index, only, option}) => ({
  code: 'Value restriction violated',
  msg:  'A value lies outside the allowed values of an option.',
  info: {key, values, index, only, option}
})

const wrongArgsRulesType = ({type, args}) => ({
  code: 'Wrong args rules type',
  msg:  'The args rules are of a wrong type, please provide a predicate with the following signature: (args) => boolean',
  info: {type, args}
})

const wrongArgvRulesType = ({type, argv}) => ({
  code: 'Wrong argv rules type',
  msg:  'The argv rules are of a wrong type, please provide a predicate with the following signature: (argv) => boolean',
  info: {type, argv}
})

const wrongOptsRulesType = ({type, options}) => ({
  code: 'Wrong opts rules type',
  msg:  'The opts rules are of a wrong type, please provide a predicate with the following signature: (options) => boolean',
  info: {type, options}
})

const wrongRulesType = ({key, type, options}) => ({
  code: 'Wrong rules type',
  msg:  'The rules have a wrong type, please provide a predicate with the following signature: (option) => (options) => boolean',
  info: {key, type, options}
})

module.exports = {
  argumentIsNotABool,
  argumentIsNotANumber,
  commandRequired,
  didYouMean,
  falseArgsRules,
  falseArgvRules,
  falseOptsRules,
  falseRules,
  invalidArity,
  invalidOptionsListInCombine,
  invalidTypes,
  invalidValues,
  nonMatchingArgumentTypes,
  requiredOptionFormat,
  requiredOptionMissing,
  unexpectedArgument,
  valueRestrictionsViolated,
  wrongArgsRulesType,
  wrongArgvRulesType,
  wrongOptsRulesType,
  wrongRulesType
}