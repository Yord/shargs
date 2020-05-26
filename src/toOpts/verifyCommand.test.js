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

test('verifyCommand fails for programs with wrong key syntax', () => {
  const opt = {
    key: null,
    opts: []
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt}), InvalidKey({opt})]
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for programs without opts', () => {
  const opt = {
    key: 'foo'
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt})]
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for programs with wrong opts syntax', () => {
  const opt = {
    key: 'foo',
    opts: 'bar'
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [CommandExpected({opt}), InvalidOpts({opt})]
  }

  expect(res).toStrictEqual(exp)
})

test('verifyCommand fails for nested programs with wrong opts syntax', () => {
  const bar = {
    key: 'bar',
    opts: []
  }

  const opt = {
    key: 'foo',
    opts: [
      bar
    ]
  }

  const res = verifyCommand(opt)

  const exp = {
    errs: [InvalidNestedCommand({opt: bar})],
    opt: {...opt, opts: []}
  }

  expect(res).toStrictEqual(exp)
})