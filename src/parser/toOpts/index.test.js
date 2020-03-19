const toOpts  = require('./index')
const combine = require('../combinators/combine')
const option  = require('../combinators/option')
const {array, bool, command, flag, number, string} = require('../../options')

const deleteArgs = obj => {
  delete obj.args
  return obj
}

const numberBool = array(['number', 'bool'])

const opts = [
  string('title', ['--title']),
  numberBool('numBool', ['-n', '--nb']),
  number('answer', ['-a', '--answer']),
  command('help', ['-h', '--help']),
  bool('verbose', ['--verbose']),
  flag('version', ['--version'])
]

const combined = combine(...opts.map(option)).args

test('toOpts transforms argv into opts', () => {
  const obj = {
    argv: [
      'foo',
      '--title', "The Hitchhiker's Guide to the Galaxy",
      '-n', '23', 'true',
      '-a', '42',
      '--verbose', 'false',
      '--version',
      'bar',
      '-h', 'foo', '--bar'
    ]
  }

  const {opts} = toOpts(combined)(obj)

  const exp = [
    {values: ['foo']},
    deleteArgs({...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]}),
    deleteArgs({...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']}),
    deleteArgs({...number('answer', ['-a', '--answer']), values: ['42']}),
    deleteArgs({...bool('verbose', ['--verbose']), values: ['false']}),
    deleteArgs({...flag('version', ['--version']), values: []}),
    {values: ['bar']},
    deleteArgs({...command('help', ['-h', '--help']), values: ['foo', '--bar']})
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts keeps unrecognized strings', () => {
  const obj = {
    argv: [
      'foo',
      'bar'
    ]
  }

  const {opts} = toOpts(combined)(obj)

  const exp = [
    {values: ['foo']},
    {values: ['bar']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms unary options', () => {
  const obj = {
    argv: [
      '--title', "The Hitchhiker's Guide to the Galaxy"
    ]
  }

  const {opts} = toOpts(combined)(obj)

  const exp = [
    deleteArgs({...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms command opts at the end of the line', () => {
  const obj = {
    argv: [
      '-h', 'foo', '--bar'
    ]
  }

  const {opts} = toOpts(combined)(obj)

  const exp = [
    deleteArgs({...command('help', ['-h', '--help']), values: ['foo', '--bar']})
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms command opts at the end of the line with double minusses', () => {
  const obj = {
    argv: [
      'foo',
      '-h', 'foo', '--bar',
      '--'
    ]
  }

  const {opts} = toOpts(combined)(obj)

  const exp = [
    {values: ['foo']},
    deleteArgs({...command('help', ['-h', '--help']), values: ['foo', '--bar']}),
    {values: ['--']}
  ]

  expect(opts).toStrictEqual(exp)
})