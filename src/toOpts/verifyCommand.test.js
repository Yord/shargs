const {verifyCommand} = require('./verifyCommand')
const {
  CommandExpected,
  InvalidArgs,
  InvalidKey,
  InvalidOpts,
  InvalidTypes,
  InvalidNestedCommand,
  OptionExpected,
  PosArgExpected,
  SubcommandExpected,
  UnknownCommandLineOptionType
} = require('../errors')

test('verifyCommand works for empty programs', () => {
  const opt = {
    key: 'foo',
    opts: []
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [],
    opt
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for programs without key', () => {
  const opt = {
    opts: []
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt})]
  }

  expect(res).toStrictEqual(exp)
})