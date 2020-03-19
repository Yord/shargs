const toArgs = require('./index')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

const discard = () => () => ({
  args: {discarded: true}
})

test('toArgs transforms opts into args', () => {
  const obj = {
    opts: [
      {values: ['foo']},
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
      {...number('answer', ['-a', '--answer']), values: [42]},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: [false]},
      {...flag('version', ['--version']), values: [true]},
      {values: ['bar']}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: ['foo', 'bar'],
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    answer: 42,
    help: {discarded: true},
    verbose: false,
    version: {count: 1}
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs removes double minus', () => {
  const obj = {
    opts: [
      {values: ['--']}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: []
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs represents flags as counts', () => {
  const obj = {
    opts: [
      {...flag('verbose', ['-v']), values: [true]}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: [],
    verbose: {count: 1}
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs counts the occurrences of flags', () => {
  const obj = {
    opts: [
      {...flag('verbose', ['-v']), values: [true]},
      {...flag('verbose', ['-v']), values: [true]},
      {...flag('verbose', ['-v']), values: [true]}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: [],
    verbose: {count: 3}
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs works if opts is undefined', () => {
  const obj = {}

  const {args} = toArgs(discard)(obj)

  expect(args).toStrictEqual({_: []})
})

test('toArgs works if input is undefined', () => {
  const {args} = toArgs(discard)()

  expect(args).toStrictEqual({_: []})
})

test('toArgs passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = toArgs(discard)({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})