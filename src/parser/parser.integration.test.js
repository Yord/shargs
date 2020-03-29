const parser            = require('./combinators/parser')

const splitShortOptions = require('./argv/splitShortOptions')
const verifyArgv        = require('./argv/verifyArgv')
const bestGuessOpts     = require('./opts/bestGuessOpts')
const cast              = require('./opts/cast')
const demandACommand    = require('./opts/demandACommand')
const requireOptions    = require('./opts/requireOptions')
const restrictToOnly    = require('./opts/restrictToOnly')
const reverseBools      = require('./opts/reverseBools')
const reverseFlags      = require('./opts/reverseFlags')
const suggestOptions    = require('./opts/suggestOptions')
const verifyOpts        = require('./opts/verifyOpts')
const verifyRules       = require('./opts/verifyRules')
const verifyValuesArity = require('./opts/verifyValuesArity')
const bestGuessRest     = require('./args/bestGuessRest')
const clearRest         = require('./args/clearRest')
const failRest          = require('./args/failRest')
const flagsAsBools      = require('./args/flagsAsBools')
const flagsAsNumbers    = require('./args/flagsAsNumbers')
const mergeArgs         = require('./args/mergeArgs')
const transformArgs     = require('./args/transformArgs')
const verifyArgs        = require('./args/verifyArgs')

const {bool, command, flag, number, string} = require('../options')
const {argumentIsNotANumber, commandRequired, didYouMean, falseArgsRules, falseArgvRules, falseOptsRules, falseRules, invalidValues, requiredOptionMissing, unexpectedArgument, valueRestrictionsViolated} = require('../errors')

const noCommands = opts => opts.filter(({types}) => types !== null)

const filterErrs = keys => errs => errs.map(
  ({info, ...rest}) => Object.keys(info).reduce(
    (acc, key) => ({
      ...acc,
      info: {
        ...acc.info,
        ...(keys.indexOf(key) === -1 ? {[key]: info[key]} : {[key]: undefined})
      }
    }),
    {info: {}, ...rest}
  )
)

const opts = [
  flag('help', ['--help']),
  flag('verbose', ['-v', '--verbose']),
  flag('popcorn', ['-l', '--low-fat'], {reverse: true}),
  bool('fantasy', ['-E', '--no-hobbits'], {reverse: true}),
  string('genre', ['-g', '--genre'], {required: true}),
  number('hours', ['-h', '--hours'], {defaultValues: 2}),
  bool('smile', ['--smile'], {defaultValues: ['true']}),
  command('rate', ['rate'], {opts: [
    number('stars', ['-s', '--stars'], {only: ['1', '2', '3', '4', '5']})
  ]}),
  string('query', ['-q', '--query'], {
    rules: title => opts => (
      !title.values[0].includes('Supersize Me') ||
      opts.some(_ => _.key === 'popcorn' && _.values.count === 0)
    )
  })
]

const argv = [
  '--query', 'Supersize Me',
  '--colors',
  '-l',
  '--no-hobbits', 'true',
  '-vv',
  'rate',
    '--stars', '8',
    '--help'
]

test('parser without stages works as expected', () => {
  const stages = {}

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only splitShortOptions works as expected', () => {
  const stages = {
    argv: [splitShortOptions]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true',
    verbose: {type: 'flag', count: 2}
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only verifyArgv works as expected', () => {
  const argvRules = argv => argv.some(_ => _ === '--fancy')

  const checks = {
    argv: [verifyArgv(argvRules)]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    falseArgvRules({argv})
  ]

  const errs2 = filterErrs(['rules'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only bestGuessOpts works as expected', () => {
  const stages = {
    opts: [bestGuessOpts]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      help: {type: 'flag', count: 1},
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true',
    colors: {type: 'flag', count: 1}
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only cast works as expected', () => {
  const stages = {
    opts: [cast]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: true,
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: 8
    },
    query: 'Supersize Me',
    smile: true
  }

  const expErrs = [
    argumentIsNotANumber({defaultValues: 2, index: 0}),
    argumentIsNotANumber({defaultValues: 2, index: 0})
  ]

  const errs2 = filterErrs(['option'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only demandACommand works as expected if no command is present', () => {
  const stages = {
    opts: [demandACommand]
  }

  const opts2 = noCommands(opts)

  const {errs, args} = parser(stages)(opts2)(argv)

  const expArgs = {
    _: ['--colors', '-vv', 'rate', '--stars', '8'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    commandRequired({})
  ]

  const errs2 = filterErrs(['options'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only demandACommand works as expected if a command is present', () => {
  const checks = {
    opts: [demandACommand]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only requireOptions works as expected', () => {
  const checks = {
    opts: [requireOptions]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    requiredOptionMissing({key: 'genre', args: ['-g', '--genre']})
  ]

  const errs2 = filterErrs(['option'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only restrictToOnly works as expected', () => {
  const stages = {
    opts: [restrictToOnly]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help']
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    valueRestrictionsViolated({key: 'stars', values: ['8'], index: 0, only: ['1', '2', '3', '4', '5']})
  ]

  const errs2 = filterErrs(['option'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only reverseBools works as expected', () => {
  const stages = {
    opts: [reverseBools]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'false',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only reverseFlags works as expected', () => {
  const stages = {
    opts: [reverseFlags]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: -1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only suggestOptions works as expected', () => {
  const checks = {
    opts: [suggestOptions]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    didYouMean({argv: '--colors'}),
    didYouMean({argv: '-vv'})
  ]

  const errs2 = filterErrs(['options'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only verifyOpts works as expected', () => {
  const optsRules = opts => (
    !opts.some(_ => _.key === 'genre') ||
    opts.every(_ => _.key !== 'genre' || _.values)
  )

  const checks = {
    opts: [verifyOpts(optsRules)]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    falseOptsRules({})
  ]

  const errs2 = filterErrs(['options', 'rules'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only verifyRules works as expected', () => {
  const checks = {
    opts: [verifyRules]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    falseRules({key: 'query'})
  ]

  const errs2 = filterErrs(['rules', 'option'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only verifyValuesArity works as expected', () => {
  const checks = {
    opts: [verifyValuesArity]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    invalidValues({defaultValues: 2})
  ]

  const errs2 = filterErrs(['option'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only bestGuessRest works as expected', () => {
  const stages = {
    args: [bestGuessRest]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['-vv'],
    colors: {type: 'flag', count: 1},
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      help: {type: 'flag', count: 1},
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only clearRest works as expected', () => {
  const stages = {
    args: [clearRest]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: [],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only failRest works as expected', () => {
  const checks = {
    args: [failRest]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    unexpectedArgument({argument: '--colors'}),
    unexpectedArgument({argument: '-vv'}),
    unexpectedArgument({argument: '--help'})
  ]

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only flagsAsBools works as expected', () => {
  const stages = {
    args: [flagsAsBools]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: true,
    popcorn: true,
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only flagsAsNumbers works as expected', () => {
  const stages = {
    args: [flagsAsNumbers]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: 1,
    popcorn: 1,
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only mergeArgs works as expected', () => {
  const stages = {
    args: [mergeArgs()]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv', '--help'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    stars: '8',
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only transformArgs works as expected', () => {
  const stages = {
    args: [
      transformArgs({
        flag: ({key, errs, args}) => ({
          errs,
          args: key !== 'popcorn' ? args : {...args, popcorn: true}
        })
      })
    ]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: true,
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = []

  const errs2 = filterErrs([])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with only verifyArgs works as expected', () => {
  const argsRules = args => !args.query || args.query.indexOf('Terminator') > -1

  const checks = {
    args: [verifyArgs(argsRules)]
  }

  const stages = {}

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: '8'
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    falseArgsRules({})
  ]

  const errs2 = filterErrs(['rules', 'args'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser with custom parser functions for the rate command works as expected', () => {
  const rules = args => !args.query || args.query.indexOf('Terminator') > -1

  const checks = {
    args: [verifyArgs(rules)]
  }

  const stages = {}

  const parsers = {
    rate: parser({
      opts: [cast]
    })
  }

  const {errs, args} = parser(stages, {checks, parsers})(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    help: {type: 'flag', count: 1},
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: ['--help'],
      stars: 8
    },
    query: 'Supersize Me',
    smile: 'true'
  }

  const expErrs = [
    falseArgsRules({})
  ]

  const errs2 = filterErrs(['rules', 'args'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

test('parser works with complex stages setup', () => {
  const argvRules = argv => argv.some(_ => _ === '--fancy')

  const optsRules = opts => (
    !opts.some(_ => _.key === 'genre') ||
    opts.every(_ => _.key !== 'genre' || _.values)
  )

  const argsRules = args => !args.query || args.query.indexOf('Terminator') > -1

  const checks = {
    argv: [
      verifyArgv(argvRules)
    ],
    opts: [
      demandACommand,
      requireOptions,
      verifyOpts(optsRules),
      verifyRules,
      verifyValuesArity
    ],
    args: [
      failRest,
      verifyArgs(argsRules)
    ]
  }

  const stages = {
    argv: [
      splitShortOptions
    ],
    opts: [
      restrictToOnly,
      reverseBools,
      reverseFlags,
      suggestOptions,
      cast
    ],
    args: [
      mergeArgs(),
      transformArgs({
        flag: ({key, val: {count}, errs, args}) => ({
          errs,
          args: {...args, [key]: key === 'verbose' ? count : count > 0}
        })
      })
    ]
  }

  const {errs, args} = parser(stages, {checks})(opts)(argv)

  const expArgs = {
    _: ['--colors', '--help'],
    fantasy: false,
    help: true,
    popcorn: false,
    query: 'Supersize Me',
    smile: true,
    verbose: 2
  }

  const expErrs = [
    falseArgvRules({argv}),
    requiredOptionMissing({key: 'genre'}),
    falseOptsRules({}),
    falseRules({key: 'query'}),
    invalidValues({defaultValues: 2}),
    didYouMean({argv: '--colors'}),
    argumentIsNotANumber({defaultValues: 2, index: 0}),
    valueRestrictionsViolated({key: 'stars', values: ['8'], index: 0, only: ['1', '2', '3', '4', '5']}),
    didYouMean({argv: '--help'}),
    argumentIsNotANumber({defaultValues: 2, index: 0}),
    unexpectedArgument({argument: '--colors'}),
    unexpectedArgument({argument: '--help'}),
    falseArgsRules({})
  ]

  const errs2 = filterErrs(['args', 'options', 'option', 'rules'])(errs)

  expect(args).toStrictEqual(expArgs)
  expect(errs2).toStrictEqual(expErrs)
})

// bestGuessOpts
// bestGuessRest
// clearRest
// flagsAsBools
// flagsAsNumbers