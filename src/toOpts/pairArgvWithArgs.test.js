const pairArgvWithArgs = require('./pairArgvWithArgs')

const OPTS = [
  {key: 'positional', types: ['string'], args: null},
  {key: 'title', types: ['string'], args: ['--title']},
  {key: 'numBool', types: ['number', 'bool'], args: ['-n', '--nb']},
  {key: 'answer', types: ['number'], args: ['-a', '--answer']},
  {key: 'help', types: null, args: ['-h', '--help']},
  {key: 'verbose', types: ['bool'], args: ['--verbose']},
  {key: 'version', types: [], args: ['--version']}
]

test('pairArgvWithArgs transforms argv into opts', () => {
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

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = [
    {values: ['foo']},
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

test('pairArgvWithArgs returns an unmatched value if an option has too few argvs', () => {
  const obj = {
    argv: [
      '--name'
    ]
  }

  const testDefault = {key: 'name', types: ['string'], args: ['-n']}

  const {opts} = pairArgvWithArgs([testDefault])(obj)

  const exp = [
    {values: ['--name']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('pairArgvWithArgs transforms unary options', () => {
  const obj = {
    argv: [
      '--title', "The Hitchhiker's Guide to the Galaxy"
    ]
  }

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = [
    {key: 'title', types: ['string'], args: ['--title'], values: ["The Hitchhiker's Guide to the Galaxy"]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('pairArgvWithArgs transforms command opts at the end of the line', () => {
  const obj = {
    argv: [
      '-h', 'foo', '--bar'
    ]
  }

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = [
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('pairArgvWithArgs transforms command opts at the end of the line with double minusses', () => {
  const obj = {
    argv: [
      'foo',
      '-h', 'foo', '--bar',
      '--'
    ]
  }

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = [
    {values: ['foo']},
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']},
    {values: ['--']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('pairArgvWithArgs transforms command opts at the start of the line with double minusses', () => {
  const obj = {
    argv: [
      '-h', 'foo', '--bar',
      '--',
      'foo'
    ]
  }

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = [
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']},
    {values: ['--']},
    {values: ['foo']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('pairArgvWithArgs transforms command opts in the middle of the line with double minusses', () => {
  const obj = {
    argv: [
      'foo',
      '-h', 'foo', '--bar',
      '--',
      'foo'
    ]
  }

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = [
    {values: ['foo']},
    {key: 'help', types: null, args: ['-h', '--help'], values: ['foo', '--bar']},
    {values: ['--']},
    {values: ['foo']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('pairArgvWithArgs works with commands that have no argv', () => {
  const obj = {
    argv: [
      '-h'
    ]
  }

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = [
    {key: 'help', types: null, args: ['-h', '--help'], values: []}
  ]

  expect(opts).toStrictEqual(exp)
})

test('pairArgvWithArgs transforms empty argv into empty opts', () => {
  const obj = {
    argv: []
  }

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = []

  expect(opts).toStrictEqual(exp)
})

test('pairArgvWithArgs transforms missing argv into empty opts', () => {
  const obj = {}

  const {opts} = pairArgvWithArgs(OPTS)(obj)

  const exp = []

  expect(opts).toStrictEqual(exp)
})