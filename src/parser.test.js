const parser = require('./parser')
const toOpts = require('./toOpts')
const toArgs = require('./toArgs')

const opts = [
  {key: 'title', types: ['string'], args: ['--title']},
  {key: 'numBool', types: ['number', 'bool'], args: ['-n', '--nb']},
  {key: 'answer', types: ['number'], args: ['-a', '--answer']},
  {key: 'help', types: null, args: ['-h', '--help'], opts: [{key: 'bar', types: [], args: ['--bar']}]},
  {key: 'verbose', types: ['bool'], args: ['--verbose']},
  {key: 'version', types: [], args: ['--version', '-V']}
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
    _: ['foo', 'bar', 'foo'],
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: ['23', 'true'],
    answer: '42',
    verbose: 'false',
    version: {type: 'flag', count: 1},
    help: {
      _: ['foo'],
      bar: {type: 'flag', count: 1}
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
    _: ['foo', 'bar', 'foo'],
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: ['23', 'true'],
    answer: '42',
    verbose: 'false',
    version: {type: 'flag', count: 1},
    help: {
      _: ['foo'],
      bar: {type: 'flag', count: 1}
    }
  }

  expect(args).toStrictEqual(exp)
})

test('parser applies argv stages', () => {
  const argv = [
    '-VV'
  ]

  const splitShortOptions = ({argv}) => ({
    argv: argv.reduce(
      (arr, _) => [...arr, ..._.slice(1).split('').map(_ => '-' + _)],
      []
    )
  })

  const stages = {
    argv: [splitShortOptions]
  }

  const {args} = parser(stages)(opts)(argv)

  const exp = {
    _: [],
    version: {type: 'flag', count: 2}
  }

  expect(args).toStrictEqual(exp)
})

test('parser applies opts stages', () => {
  const argv = [
    '-n', '23', 'true'
  ]

  const cast = ({opts}) => ({
    opts: opts.map(
      opt => opt.key !== 'numBool' ? opt : {...opt, values: [23, true]}
    )
  })

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

  const clearRest = ({args}) => ({
    args: {_: []}
  })

  const stages = {
    args: [clearRest]
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

test('parser works with undefined argv', () => {
  const stages = {}

  const {args} = parser(stages)(opts)()

  const exp = {
    _: []
  }

  expect(args).toStrictEqual(exp)
})

test('parser uses a custom toOpts function', () => {
  const argv = [
    'foo'
  ]

  const stages = {
    toOpts
  }

  const {args} = parser(stages)(opts)(argv)

  const exp = {
    _: ['foo']
  }

  expect(args).toStrictEqual(exp)
})

test('parser uses a custom toArgs function', () => {
  const argv = [
    'foo'
  ]

  const stages = {
    toArgs: toArgs()
  }

  const {args} = parser(stages)(opts)(argv)

  const exp = {
    _: ['foo']
  }

  expect(args).toStrictEqual(exp)
})