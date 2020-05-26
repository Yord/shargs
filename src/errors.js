const CommandExpected = ({opt}) => ({
  code: 'CommandExpected',
  msg:  '', // with key and opts array
  info: {opt}
})

const InvalidArgs = ({opt}) => ({
  code: 'InvalidArgs',
  msg:  '', // TODO: args syntax is wrong
  info: {opt}
})

const InvalidKey = ({opt}) => ({
  code: 'InvalidKey',
  msg:  '', // TODO: args syntax is wrong
  info: {opt}
})

const InvalidNestedCommand = ({opt}) => ({
  code: 'InvalidNestedCommand',
  msg:  '', // TODO: error because commands cannot be wrapped in commands
  info: {opt}
})

const InvalidOpts = ({opt}) => ({
  code: 'InvalidOpts',
  msg:  '', // TODO: opts syntax is wrong
  info: {opt}
})

const InvalidTypes = ({opt}) => ({
  code: 'InvalidTypes',
  msg:  '', // TODO: types syntax is wrong
  info: {opt}
})

const OptionExpected = ({opt}) => ({
  code: 'OptionExpected',
  msg:  '',
  info: {opt}
})

const PosArgExpected = ({opt}) => ({
  code: 'PosArgExpected',
  msg:  '',
  info: {opt}
})

const SubcommandExpected = ({opt}) => ({
  code: 'SubcommandExpected',
  msg:  '',
  info: {opt}
})

const UnknownCommandLineOptionType = ({opt}) => ({
  code: 'UnknownCommandLineOptionType',
  msg:  '', // TODO: unknown option type error
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