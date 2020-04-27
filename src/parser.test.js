const {parser, toArgs, toOpts} = require('.')

const promise = f => a => new Promise(
  (resolve, reject) => {
    try {
      resolve(f(a))
    } catch (err) {
      reject(err)
    }
  }
)

const opts = [
  {key: 'title', types: ['string'], args: ['--title']},
  {key: 'numBool', types: ['number', 'bool'], args: ['-n', '--nb']},
  {key: 'answer', types: ['number'], args: ['-a', '--answer']},
  {key: 'help', args: ['-h', '--help'], opts: [{key: 'bar', types: [], args: ['--bar']}]},
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

test('async parser transforms argv to args', async () => {
  expect.assertions(1)

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

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

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

test('async parser works even if stages are undefined', async () => {
  expect.assertions(1)

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

  const {args} = await parser(undefined, {mode: 'async'})(opts)(argv)

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

test('async parser applies argv stages that are not promises', async () => {
  expect.assertions(1)
  
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

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

  const exp = {
    _: [],
    version: {type: 'flag', count: 2}
  }

  expect(args).toStrictEqual(exp)
})

test('async parser applies argv stages that are promises', async () => {
  expect.assertions(1)
  
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
    argv: [promise(splitShortOptions)]
  }

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

  const exp = {
    _: [],
    version: {type: 'flag', count: 2}
  }

  expect(args).toStrictEqual(exp)
})

test('async parser applies argv stages that are promises in commands', async () => {
  expect.assertions(1)
  
  const argv = [
    'command', '-VV'
  ]

  const splitShortOptions = ({argv}) => ({
    argv: argv.reduce(
      (arr, _) => [
        ...arr,
        ...(_.length > 2 && _[0] === '-' && _[1] !== '-' ? _.slice(1).split('').map(_ => '-' + _) : [_])
      ],
      []
    )
  })

  const stages = {
    argv: [promise(splitShortOptions)]
  }

  const opts = [
    {key: 'command', args: ['command'], opts: [
      {key: 'version', args: ['-V'], types: []}
    ]}
  ]

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

  const exp = {
    _: [],
    command: {
      _: [],
      version: {type: 'flag', count: 2}
    }
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

test('async parser applies opts stages that are not promises', async () => {
  expect.assertions(1)

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

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

  const exp = {
    _: [],
    numBool: [23, true]
  }

  expect(args).toStrictEqual(exp)
})

test('async parser applies opts stages that are promises', async () => {
  expect.assertions(1)

  const argv = [
    '-n', '23', 'true'
  ]

  const cast = ({opts}) => ({
    opts: opts.map(
      opt => opt.key !== 'numBool' ? opt : {...opt, values: [23, true]}
    )
  })

  const stages = {
    opts: [promise(cast)]
  }

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

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

test('async parser applies args stages that are not promises', async () => {
  expect.assertions(1)

  const argv = [
    'foo'
  ]

  const clearRest = ({args}) => ({
    args: {_: []}
  })

  const stages = {
    args: [clearRest]
  }

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

  const exp = {
    _: []
  }

  expect(args).toStrictEqual(exp)
})

test('async parser applies args stages that are promises', async () => {
  expect.assertions(1)

  const argv = [
    'foo'
  ]

  const clearRest = ({args}) => ({
    args: {_: []}
  })

  const stages = {
    args: [promise(clearRest)]
  }

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

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

test('async parser works with empty opts', async () => {
  expect.assertions(1)

  const argv = [
    'foo'
  ]

  const stages = {}

  const {args} = await parser(stages, {mode: 'async'})([])(argv)

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

test('async parser works with undefined opts', async () => {
  expect.assertions(1)

  const argv = [
    'foo'
  ]

  const stages = {}

  const {args} = await parser(stages, {mode: 'async'})()(argv)

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

test('async parser works with empty argv', async () => {
  expect.assertions(1)

  const argv = []

  const stages = {}

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

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

test('async parser works with undefined argv', async () => {
  expect.assertions(1)

  const stages = {}

  const {args} = await parser(stages, {mode: 'async'})(opts)()

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

test('async parser uses a custom toOpts function', async () => {
  expect.assertions(1)

  const argv = [
    'foo'
  ]

  const stages = {
    toOpts
  }

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

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

test('async parser uses a custom toArgs function', async () => {
  expect.assertions(1)

  const argv = [
    'foo'
  ]

  const stages = {
    toArgs: toArgs()
  }

  const {args} = await parser(stages, {mode: 'async'})(opts)(argv)

  const exp = {
    _: ['foo']
  }

  expect(args).toStrictEqual(exp)
})

test('parser uses the first option if options are defined several times 1/3', () => {
  const tired = {key: 'tired', types: ['bool'], args: ['-t', '--tired']}
  const help  = {key: 'help', args: ['help'], opts: []}

  const opts = [
    tired,
    help
  ]

  const stages = {}

  const parse = parser(stages)(opts)

  const argv = ['--tired', 'true', '--tired', 'false', 'help']

  const {errs, args} = parse(argv)

  const expErrs = []

  const expArgs = {
    _: [],
    tired: 'true',
    help: {
      _: []
    }
  }

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('parser uses the first option if options are defined several times 2/3', () => {
  const tired = {key: 'tired', types: ['bool'], args: ['-t', '--tired']}
  const help  = {key: 'help', args: ['help'], opts: []}

  const opts = [
    tired,
    help
  ]

  const stages = {}

  const parse = parser(stages)(opts)

  const argv = ['--tired', 'true', 'help', '--tired', 'false']

  const {errs, args} = parse(argv)

  const expErrs = []

  const expArgs = {
    _: ['--tired', 'false'],
    help: {
      _: ['--tired', 'false']
    },
    tired: 'true'
  }

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('parser uses the first option if options are defined several times 3/3', () => {
  const tired = {key: 'tired', types: ['bool'], args: ['-t', '--tired']}
  const help  = {key: 'help', args: ['help'], opts: []}

  const opts = [
    tired,
    help
  ]

  const stages = {}

  const parse = parser(stages)(opts)

  const argv = ['help', '--tired', 'true', '--tired', 'false']

  const {errs, args} = parse(argv)

  const expErrs = []

  const expArgs = {
    _: [],
    help: {
      _: ['--tired', 'true', '--tired', 'false']
    },
    tired: 'true'
  }

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})