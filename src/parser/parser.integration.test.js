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

const noInfo = ({info, ...rest}) => rest

const opts = [
  flag('verbose', ['-v', '--verbose']),
  flag('popcorn', ['-l', '--low-fat'], {reverse: true}),
  bool('fantasy', ['-E', '--no-hobbits'], {reverse: true}),
  string('genre', ['-g', '--genre'], {required: true}),
  number('hours', ['-h', '--hours'], {values: 2}),
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

const argv = ['--query', 'Supersize Me', '--colors', '-l', '--no-hobbits', 'true', '-vv', 'rate', '--stars', '8']

test('parser with only splitShortOptions works as expected', () => {
  const stages = {
    argv: [splitShortOptions]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me',
    verbose: {type: 'flag', count: 2}
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only verifyArgv works as expected', () => {
  const rules = argv => argv.some(_ => _ === '--fancy')

  const stages = {
    argv: [verifyArgv(rules)]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    falseArgvRules({}),
    falseArgvRules({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
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
      stars: '8'
    },
    query: 'Supersize Me',
    colors: {type: 'flag', count: 1}
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only cast works as expected', () => {
  const stages = {
    opts: [cast]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: true,
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: 8
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    argumentIsNotANumber({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only demandACommand works as expected', () => {
  const stages = {
    opts: [demandACommand]
  }

  const opts2 = noCommands(opts)

  const {errs, args} = parser(stages)(opts2)(argv)

  const expArgs = {
    _: ['--colors', '-vv', 'rate', '--stars', '8'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    query: 'Supersize Me'
  }

  const expErrs = [
    commandRequired({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only requireOptions works as expected', () => {
  const stages = {
    opts: [requireOptions]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    requiredOptionMissing({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only restrictToOnly works as expected', () => {
  const stages = {
    opts: [restrictToOnly]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: []
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    valueRestrictionsViolated({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only reverseBools works as expected', () => {
  const stages = {
    opts: [reverseBools]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'false',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only reverseFlags works as expected', () => {
  const stages = {
    opts: [reverseFlags]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: -1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only suggestOptions works as expected', () => {
  const stages = {
    opts: [suggestOptions]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    didYouMean({}),
    didYouMean({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only verifyOpts works as expected', () => {
  const rules = opts => (
    !opts.some(_ => _.key === 'genre') ||
    opts.every(_ => _.key !== 'genre' || _.values)
  )

  const stages = {
    opts: [verifyOpts(rules)]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    falseOptsRules({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only verifyRules works as expected', () => {
  const stages = {
    opts: [verifyRules]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    falseRules({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only verifyValuesArity works as expected', () => {
  const stages = {
    opts: [verifyValuesArity]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    invalidValues({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
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
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
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
    query: 'Supersize Me'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only failRest works as expected', () => {
  const stages = {
    args: [failRest]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = [
    unexpectedArgument({}),
    unexpectedArgument({})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only flagsAsBools works as expected', () => {
  const stages = {
    args: [flagsAsBools]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: true,
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only flagsAsNumbers works as expected', () => {
  const stages = {
    args: [flagsAsNumbers]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: 1,
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})

test('parser with only mergeArgs works as expected', () => {
  const stages = {
    args: [mergeArgs()]
  }

  const {errs, args} = parser(stages)(opts)(argv)

  const expArgs = {
    _: ['--colors', '-vv'],
    fantasy: 'true',
    popcorn: {type: 'flag', count: 1},
    stars: '8',
    query: 'Supersize Me'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
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
    popcorn: true,
    rate: {
      _: [],
      stars: '8'
    },
    query: 'Supersize Me'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs.map(noInfo)).toStrictEqual(expErrs.map(noInfo))
})