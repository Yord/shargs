const requireOptions = require('./requireOptions')
const {requiredOptionFormat, requiredOptionMissing} = require('../errors')

test('requireOptions README example works', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true}

  const obj = {
    opts: [answer]
  }

  const {errs} = requireOptions(obj)

  const expErrs = [
    requiredOptionMissing({key: answer.key, args: answer.args, option: answer})
  ]

  expect(errs).toStrictEqual(expErrs)
})

test('requireOptions keeps all options in opts', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true}
  const question = {key: 'question', types: ['number'], args: ['-q', '--question'], required: true, values: ['Are values fine?']}

  const obj = {
    opts: [answer, question]
  }

  const {errs, opts} = requireOptions(obj)

  const expErrs = [
    requiredOptionMissing({key: answer.key, args: answer.args, option: answer})
  ]

  const expOpts = obj.opts

  expect(errs).toStrictEqual(expErrs)
  expect(opts).toStrictEqual(expOpts)
})

test('requireOptions works as expected on all types', () => {
  const obj = {
    opts: [
      {key: 'title', types: ['string'], args: ['--title'], required: true},
      {key: 'numBool', types: ['number', 'bool'], args: ['-n', '--nb'], required: true},
      {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true},
      {key: 'help', types: null, args: ['-h', '--help'], required: true},
      {key: 'verbose', types: ['bool'], args: ['--verbose'], required: true},
      {key: 'version', types: [], args: ['--version'], required: true}
    ]
  }

  const {errs} = requireOptions(obj)

  const exp = obj.opts.map(option =>
    requiredOptionMissing({key: option.key, args: option.args, option})
  )

  expect(errs).toStrictEqual(exp)
})

test('requireOptions works if required is false', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: false}

  const obj = {
    opts: [answer]
  }

  const {errs, opts} = requireOptions(obj)

  const expErrs = []

  const expOpts = obj.opts

  expect(errs).toStrictEqual(expErrs)
  expect(opts).toStrictEqual(expOpts)
})

test('requireOptions works if required is undefined', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer']}

  const obj = {
    opts: [answer]
  }

  const {errs, opts} = requireOptions(obj)

  const expErrs = []

  const expOpts = obj.opts

  expect(errs).toStrictEqual(expErrs)
  expect(opts).toStrictEqual(expOpts)
})

test('requireOptions works only with valid values', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true, values: 42}

  const obj = {
    opts: [answer]
  }

  const {errs} = requireOptions(obj)

  const exp = [
    requiredOptionFormat({key: answer.key, values: answer.values, option: answer})
  ]

  expect(errs).toStrictEqual(exp)
})

test('requireOptions works if opts is undefined', () => {
  const obj = {}

  const {errs} = requireOptions(obj)

  expect(errs).toStrictEqual([])
})

test('requireOptions works if input is undefined', () => {
  const {errs} = requireOptions()

  expect(errs).toStrictEqual([])
})

test('requireOptions passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = requireOptions({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})