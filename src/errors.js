const CommandExpected = ({opt}) => ({
  code: 'CommandExpected',
  msg:  'Expected a command with a string "key" field and an "opts" array.',
  info: {opt}
})

const InvalidArgs = ({opt}) => ({
  code: 'InvalidArgs',
  msg:  'The "args" field has an invalid value: "args" must be a non-empty array of strings.',
  info: {opt}
})

const InvalidKey = ({opt}) => ({
  code: 'InvalidKey',
  msg:  'The "key" field has an invalid value: "key" must be a string, cannot be "_" or "--", and must not include whitespaces.',
  info: {opt}
})

const InvalidNestedCommand = ({opt}) => ({
  code: 'InvalidNestedCommand',
  msg:  'Commands cannot be nested inside commands. Did you forget an "args" field for your subcommand?',
  info: {opt}
})

const InvalidOpts = ({opt}) => ({
  code: 'InvalidOpts',
  msg:  'The "opts" field has an invalid value: "opts" must be an array of command-line options and positional arguments.',
  info: {opt}
})

const InvalidTypes = ({opt}) => ({
  code: 'InvalidTypes',
  msg:  'The "types" field has an invalid value: "types" must be an array of strings.',
  info: {opt}
})

const OptionExpected = ({opt}) => ({
  code: 'OptionExpected',
  msg:  'A command-line option was expected, but something else was received.',
  info: {opt}
})

const PosArgExpected = ({opt}) => ({
  code: 'PosArgExpected',
  msg:  'A positional argument was expected, but something else was received.',
  info: {opt}
})

const SubcommandExpected = ({opt}) => ({
  code: 'SubcommandExpected',
  msg:  'A subcommand was expected, but something else was received.',
  info: {opt}
})

const UnknownCommandLineOptionType = ({opt}) => ({
  code: 'UnknownCommandLineOptionType',
  msg:  'The command-line option or positional argument given is of an unknown type.',
  info: {opt}
})

module.exports = {
  CommandExpected,
  InvalidArgs,
  InvalidKey,
  InvalidNestedCommand,
  InvalidOpts,
  InvalidTypes,
  OptionExpected,
  PosArgExpected,
  SubcommandExpected,
  UnknownCommandLineOptionType
}