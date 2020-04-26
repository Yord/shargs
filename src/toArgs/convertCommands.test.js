const {convertCommands} = require('./convertCommands')
const {parser}          = require('../parser')

const parsers = {__: parser(), _: parser()}

test('convertCommands works as expected', () => {
  const opts = [
    {key: 'name', types: ['string'], args: ['--name']},
    {key: 'variadic', args: ['--var']},
    {
      key: 'ask',
      args: ['ask'],
      opts: [
        {key: 'question', types: ['string'], args: ['-q']},
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      values: ['-q', "What's your lastname?", '--name', 'Logan', '--var', 'foo', 'bar']
    }
  ]

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    name: 'Logan',
    ask: {
      _: ['--name', 'Logan', '--var', 'foo', 'bar'],
      question: "What's your lastname?"
    },
    variadic: ['foo', 'bar']
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands works as expected if parent parser is not set', () => {
  const opts = [
    {key: 'name', types: ['string'], args: ['--name']},
    {
      key: 'ask',
      args: ['ask'],
      opts: [
        {key: 'question', types: ['string'], args: ['-q']},
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
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
    {key: 'name', types: ['string'], args: ['--name']},
    {key: 'other', args: ['other'], opts: [], values: []},
    {
      key: 'ask',
      args: ['ask'],
      opts: [
        {key: 'question', types: ['string'], args: ['-q']},
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
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

test('convertCommands only sets a command once and does not set it again if the same command is specified several times', () => {
  const opts = [
    {key: 'other', args: ['other'], opts: [], values: ['foo']},
    {key: 'other', args: ['other'], opts: [], values: ['bar']}
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: ['foo'],
    other: {
      _: ['foo']
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