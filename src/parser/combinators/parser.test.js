const parser            = require('./parser')
const splitShortOptions = require('../argv/splitShortOptions')
const cast              = require('../opts/cast')
const emptyRest         = require('../args/emptyRest')
const toOpts            = require('../toOpts')
const toArgs            = require('../toArgs')
const {noKeyProvidedInOption} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

const opts = [
  string('title', ['--title']),
  numberBool('numBool', ['-n', '--nb']),
  number('answer', ['-a', '--answer']),
  command('help', ['-h', '--help'], {opts: [flag('bar', ['--bar'])]}),
  bool('verbose', ['--verbose']),
  flag('version', ['--version', '-V'])
]

test('parser transforms argv to args', () => {
  const argv = [
    'foo',
    '--title', "The Hitchhiker's Guide to the Galaxy",
    '-n', '23', 'true',
    '-a', '42',
    '--verbose', 'false',
    '--version',
    'bar',
    '-h', 'foo', '--bar'
  ]

  const stages = {}

  const {args} = parser(stages)(opts)(argv)

  const exp = {
    _: ['foo', 'bar'],
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: ['23', 'true'],
    answer: '42',
    verbose: 'false',
    version: {count: 1},
    help: {
      _: ['foo'],
      bar: {count: 1}
    }
  }

  expect(args).toStrictEqual(exp)
})

test('parser works even if stages are undefined', () => {
  const argv = [
    'foo',
    '--title', "The Hitchhiker's Guide to the Galaxy",
    '-n', '23', 'true',
    '-a', '42',
    '--verbose', 'false',
    '--version',
    'bar',
    '-h', 'foo', '--bar'
  ]

  const {args} = parser()(opts)(argv)

  const exp = {
    _: ['foo', 'bar'],
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: ['23', 'true'],
    answer: '42',
    verbose: 'false',
    version: {count: 1},
    help: {
      _: ['foo'],
      bar: {count: 1}
    }
  }

  expect(args).toStrictEqual(exp)
})

test('parser applies argv stages', () => {
  const argv = [
    '-VV'
  ]

  const stages = {
    argv: [splitShortOptions]
  }

  const {args} = parser(stages)(opts)(argv)

  const exp = {
    _: [],
    version: {count: 2}
  }

  expect(args).toStrictEqual(exp)
})

test('parser applies opts stages', () => {
  const argv = [
    '-n', '23', 'true'
  ]

  const stages = {
    opts: [cast]
  }

  const {args} = parser(stages)(opts)(argv)

  const exp = {
    _: [],
    numBool: [23, true]
  }

  expect(args).toStrictEqual(exp)
})

test('parser applies args stages', () => {
  const argv = [
    'foo'
  ]

  const stages = {
    args: [emptyRest]
  }

  const {args} = parser(stages)(opts)(argv)

  const exp = {
    _: []
  }

  expect(args).toStrictEqual(exp)
})

test('parser works with empty opts', () => {
  const argv = [
    'foo'
  ]

  const stages = {}

  const {args} = parser(stages)([])(argv)

  const exp = {
    _: ['foo']
  }

  expect(args).toStrictEqual(exp)
})

test('parser works with undefined opts', () => {
  const argv = [
    'foo'
  ]

  const stages = {}

  const {args} = parser(stages)()(argv)

  const exp = {
    _: ['foo']
  }

  expect(args).toStrictEqual(exp)
})

test('parser works with empty argv', () => {
  const argv = []

  const stages = {}

  const {args} = parser(stages)(opts)(argv)

  const exp = {
    _: []
  }

  expect(args).toStrictEqual(exp)
})