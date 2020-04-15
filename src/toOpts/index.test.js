const toOpts  = require('./index')

const without = (keys = [], opts = []) => opts.filter(({key}) => keys.indexOf(key) === -1)

const OPTS = [
  {key: 'positional', types: ['string'], args: null},
  {key: 'title', types: ['string'], args: ['--title']},
  {key: 'numBool', types: ['number', 'bool'], args: ['-n', '--nb']},
  {key: 'answer', types: ['number'], args: ['-a', '--answer']},
  {key: 'help', types: null, args: ['-h', '--help']},
  {key: 'verbose', types: ['bool'], args: ['--verbose']},
  {key: 'version', types: [], args: ['--version']}
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
    {key: 'positional', types: ['string'], args: null, values: ['foo']},
    {key: 'title', types: ['string'], args: ['--title'], values: ["The Hitchhiker's Guide to the Galaxy"]},
    {key: 'numBool', types: ['number', 'bool'], args: ['-n', '--nb'], values: ['23', 'true']},
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: ['42']},
    {key: 'verbose', types: ['bool'], args: ['--verbose'], values: ['false']},
    {key: 'version', types: [], args: ['--version'], values: [1]},
    {values: ['bar']},
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts returns an unmatched value if an option has too few argvs', () => {
  const obj = {
    argv: [
      '--name'
    ]
  }

  const testDefault = {key: 'name', types: ['string'], args: ['-n']}

  const {opts} = toOpts([testDefault])(obj)

  const exp = [
    {values: ['--name']},
    testDefault
  ]

  expect(opts).toStrictEqual(exp)
})

test('toOpts keeps unrecognized strings after applying positional arguments', () => {
  const obj = {
    argv: [
      'foo',
      'bar'
    ]
  }

  const {opts} = toOpts(OPTS)(obj)

  const exp = [
    {key: 'positional', types: ['string'], args: null, values: ['foo']},
    {values: ['bar']},
    ...OPTS.slice(1)
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
    {key: 'title', types: ['string'], args: ['--title'], values: ["The Hitchhiker's Guide to the Galaxy"]},
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
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']},
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
    {key: 'positional', types: ['string'], args: null, values: ['foo']},
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']},
    {values: ['--']},
    ...without(['help', 'positional'], OPTS)
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
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']},
    {values: ['--']},
    {key: 'positional', types: ['string'], args: null, values: ['foo']},
    ...without(['help', 'positional'], OPTS)
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
    {key: 'positional', types: ['string'], args: null, values: ['foo']},
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']},
    {values: ['--']},
    {values: ['foo']},
    ...without(['help', 'positional'], OPTS)
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
    {key: 'help', types: null, args: ['-h', '--help'], values: []},
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