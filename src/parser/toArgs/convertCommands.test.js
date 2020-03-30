const convertCommands         = require('./convertCommands')
const {command, flag, string} = require('../../options')
const parser                  = require('../combinators/parser')

const parsers = {__: parser(), _: parser()}

test('convertCommands works as expected', () => {
  const opts = [
    string('name', ['--name']),
    {
      ...command('ask', ['ask'], {
        opts: [
          string('question', ['-q']),
          flag('jokingly', ['-j'], {defaultValue: [1]})
        ]
      }),
      values: ['-q', "What's your lastname?", '--name', 'Logan']
    }
  ]

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    name: 'Logan',
    ask: {
      _: ['--name', 'Logan'],
      question: "What's your lastname?"
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands works as expected if parent parser is not set', () => {
  const opts = [
    string('name', ['--name']),
    {
      ...command('ask', ['ask'], {
        opts: [
          string('question', ['-q']),
          flag('jokingly', ['-j'], {defaultValue: [1]})
        ]
      }),
      values: ['-q', "What's your lastname?", '--name', 'Logan']
    }
  ]

  const parsers = {_: parser()}

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: ['--name', 'Logan'],
      question: "What's your lastname?"
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands works with command-specific parsers', () => {
  const opts = [
    string('name', ['--name']),
    {...command('other', ['other']), values: []},
    {
      ...command('ask', ['ask'], {
        opts: [
          string('question', ['-q']),
          flag('jokingly', ['-j'], {defaultValue: [1]})
        ]
      }),
      values: ['-q', "What's your lastname?", '--name', 'Logan']
    }
  ]

  const parsers = {
    __: parser(),
    ask: () => () => ({args: {test: 'ask parser!'}}),
    _: () => () => ({args: {test: 'default parser!'}})
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      test: 'ask parser!'
    },
    other: {
      test: 'default parser!'
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands works if opts is undefined', () => {
  const obj = {}

  const {args} = convertCommands(parsers)(obj)

  expect(args).toStrictEqual({_: []})
})

test('convertCommands works if input is undefined', () => {
  const {args} = convertCommands(parsers)()

  expect(args).toStrictEqual({_: []})
})

test('convertCommands passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = convertCommands(parsers)({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})