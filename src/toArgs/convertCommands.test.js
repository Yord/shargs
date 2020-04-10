const convertCommands         = require('./convertCommands')
const parser                  = require('../parser')
const {invalidRequiredPositionalArgument, invalidVariadicPositionalArgument, requiredPositionalArgumentMissing} = require('../errors')

const parsers = {__: parser(), _: parser()}

test('convertCommands works as expected', () => {
  const opts = [
    {key: 'name', types: ['string'], args: ['--name']},
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'question', types: ['string'], args: ['-q']},
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      values: ['-q', "What's your lastname?", '--name', 'Logan']
    }
  ]

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    name: 'Logan',
    ask: {
      _: ['--name', 'Logan'],
      question: "What's your lastname?"
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands works as expected if parent parser is not set', () => {
  const opts = [
    {key: 'name', types: ['string'], args: ['--name']},
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'question', types: ['string'], args: ['-q']},
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      values: ['-q', "What's your lastname?", '--name', 'Logan']
    }
  ]

  const parsers = {_: parser()}

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: ['--name', 'Logan'],
      question: "What's your lastname?"
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands works with command-specific parsers', () => {
  const opts = [
    {key: 'name', types: ['string'], args: ['--name']},
    {key: 'other', types: null, args: ['other'], values: []},
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'question', types: ['string'], args: ['-q']},
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      values: ['-q', "What's your lastname?", '--name', 'Logan']
    }
  ]

  const parsers = {
    __: parser(),
    ask: () => () => ({args: {test: 'ask parser!'}}),
    _: () => () => ({args: {test: 'default parser!'}})
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      test: 'ask parser!'
    },
    other: {
      test: 'default parser!'
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands only sets a command once and does not set it again if the same command is specified several times', () => {
  const opts = [
    {key: 'other', types: null, args: ['other'], values: ['foo']},
    {key: 'other', types: null, args: ['other'], values: ['bar']}
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: ['foo'],
    other: {
      _: ['foo']
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands works with positional arguments', () => {
  const opts = [
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      posArgs: [
        {key: 'question', types: ['string'], required: true},
        {key: 'audience', types: null, variadic: true}
      ],
      values: ["What's your lastname?", '-j', 'Logan', 'Charles']
    }
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: [],
      jokingly: {type: 'flag', count: 1},
      question: "What's your lastname?",
      audience: ['Logan', 'Charles']
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands reports missing required positional arguments', () => {
  const question = {key: 'question', types: ['string'], required: true}

  const opts = [
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      posArgs: [
        question,
        {key: 'audience', types: null, variadic: true}
      ],
      values: ['-j']
    }
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: [],
      audience: [],
      jokingly: {type: 'flag', count: 1}
    }
  }

  const expErrs = [
    requiredPositionalArgumentMissing({key: question.key, positionalArgument: question})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands reports invalid variadic positional arguments', () => {
  const question = {key: 'question', types: ['string'], required: true}
  const audience = {key: 'audience', types: null, required: true, variadic: true}

  const opts = [
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      posArgs: [
        audience,
        question
      ],
      values: ["What's your lastname?", '-j', 'Logan', 'Charles']
    }
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: [],
      audience: ["What's your lastname?", 'Logan', 'Charles'],
      jokingly: {type: 'flag', count: 1}
    }
  }

  const expErrs = [
    invalidVariadicPositionalArgument({positionalArguments: [audience, question]}),
    requiredPositionalArgumentMissing({key: question.key, positionalArgument: question})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands reports invalid required positional arguments 1/2', () => {
  const question = {key: 'question', types: ['string']}
  const audience = {key: 'audience', types: null, required: true, variadic: true}

  const opts = [
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      posArgs: [
        question,
        audience
      ],
      values: ["What's your lastname?", '-j', 'Logan', 'Charles']
    }
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: [],
      audience: ['Logan', 'Charles'],
      jokingly: {type: 'flag', count: 1},
      question: "What's your lastname?"
    }
  }

  const expErrs = [
    invalidRequiredPositionalArgument({positionalArguments: [question, audience]})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands reports invalid required positional arguments 2/2', () => {
  const question = {key: 'question', types: ['string'], required: null}
  const audience = {key: 'audience', types: null, required: true, variadic: true}

  const opts = [
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      posArgs: [
        question,
        audience
      ],
      values: ["What's your lastname?", '-j', 'Logan', 'Charles']
    }
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: [],
      audience: ['Logan', 'Charles'],
      jokingly: {type: 'flag', count: 1},
      question: "What's your lastname?"
    }
  }

  const expErrs = [
    invalidRequiredPositionalArgument({positionalArguments: [question, audience]})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands takes first positional argument if two positional arguments have the same key', () => {
  const audience1 = {key: 'audience', types: ['string']}
  const audience2 = {key: 'audience', types: ['string']}

  const opts = [
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      posArgs: [
        audience1,
        audience2
      ],
      values: ['-j', 'Logan', 'Charles']
    }
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: [],
      audience: 'Logan',
      jokingly: {type: 'flag', count: 1}
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands reports missing required variadic positional arguments', () => {
  const question = {key: 'question', types: ['string'], required: true}
  const audience = {key: 'audience', types: null, required: true, variadic: true}

  const opts = [
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
      ],
      posArgs: [
        question,
        audience
      ],
      values: ["What's your lastname?", '-j']
    }
  ]

  const parsers = {
    __: parser(),
    _: parser()
  }

  const {errs, args} = convertCommands(parsers)({opts})

  const expArgs = {
    _: [],
    ask: {
      _: [],
      jokingly: {type: 'flag', count: 1},
      question: "What's your lastname?"
    }
  }

  const expErrs = [
    requiredPositionalArgumentMissing({key: audience.key, positionalArgument: audience})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertCommands works if opts is undefined', () => {
  const obj = {}

  const {args} = convertCommands(parsers)(obj)

  expect(args).toStrictEqual({_: []})
})

test('convertCommands works if input is undefined', () => {
  const {args} = convertCommands(parsers)()

  expect(args).toStrictEqual({_: []})
})

test('convertCommands passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = convertCommands(parsers)({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})