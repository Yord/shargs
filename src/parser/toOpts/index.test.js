const toOpts  = require('./index')
const {array, bool, command, flag, number, string} = require('../../options')

const without = (keys = [], opts = []) => opts.filter(({key}) => keys.indexOf(key) === -1)

const numberBool = array(['number', 'bool'])

const OPTS = [
  string('title', ['--title']),
  numberBool('numBool', ['-n', '--nb']),
  number('answer', ['-a', '--answer']),
  command('help', ['-h', '--help']),
  bool('verbose', ['--verbose']),
  flag('version', ['--version'])
]

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

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {values: ['foo']},
    {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
    {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']},
    {...number('answer', ['-a', '--answer']), values: ['42']},
    {...bool('verbose', ['--verbose']), values: ['false']},
    {...flag('version', ['--version']), values: [1]},
    {values: ['bar']},
    {...command('help', ['-h', '--help']), values: ['foo', '--bar']}
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

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {values: ['foo']},
    {values: ['bar']},
    ...OPTS
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms unary options', () => {
  const obj = {
    argv: [
      '--title', "The Hitchhiker's Guide to the Galaxy"
    ]
  }

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
    ...without(['title'], OPTS)
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms command opts at the end of the line', () => {
  const obj = {
    argv: [
      '-h', 'foo', '--bar'
    ]
  }

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {...command('help', ['-h', '--help']), values: ['foo', '--bar']},
    ...without(['help'], OPTS)
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

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {values: ['foo']},
    {...command('help', ['-h', '--help']), values: ['foo', '--bar']},
    {values: ['--']},
    ...without(['help'], OPTS)
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms command opts at the start of the line with double minusses', () => {
  const obj = {
    argv: [
      '-h', 'foo', '--bar',
      '--',
      'foo'
    ]
  }

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {...command('help', ['-h', '--help']), values: ['foo', '--bar']},
    {values: ['--']},
    {values: ['foo']},
    ...without(['help'], OPTS)
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms command opts in the middle of the line with double minusses', () => {
  const obj = {
    argv: [
      'foo',
      '-h', 'foo', '--bar',
      '--',
      'foo'
    ]
  }

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {values: ['foo']},
    {...command('help', ['-h', '--help']), values: ['foo', '--bar']},
    {values: ['--']},
    {values: ['foo']},
    ...without(['help'], OPTS)
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts works with commands that have no argv', () => {
  const obj = {
    argv: [
      '-h'
    ]
  }

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {...command('help', ['-h', '--help']), values: []},
    ...without(['help'], OPTS)
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms empty argv into empty opts', () => {
  const obj = {
    argv: []
  }

  const {opts} = toOpts(OPTS)(obj)

  const exp = OPTS

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms missing argv into empty opts', () => {
  const obj = {}

  const {opts} = toOpts(OPTS)(obj)

  const exp = OPTS

  expect(opts).toStrictEqual(exp)
})

test('toOpts transforms undefined input into empty opts', () => {
  const {opts} = toOpts(OPTS)()

  const exp = OPTS

  expect(opts).toStrictEqual(exp)
})

test('toOpts works even if opts are empty', () => {
  const obj = {
    argv: [
      '-h',
      'foo'
    ]
  }

  const {opts} = toOpts([])(obj)

  const exp = [
    {values: ['-h']},
    {values: ['foo']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts works even if opts are undefined', () => {
  const obj = {
    argv: [
      '-h',
      'foo'
    ]
  }

  const {opts} = toOpts()(obj)

  const exp = [
    {values: ['-h']},
    {values: ['foo']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = toOpts()({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})