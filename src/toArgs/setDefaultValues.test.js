const setDefaultValues       = require('./setDefaultValues')
const {invalidDefaultValues} = require('../errors')

test('setDefaultValues works as expected', () => {
  const opts = [
    {key: 'name', types: ['string'], args: ['--name'], defaultValues: ['Logan']},
    {key: 'numStr', types: ['number', 'string'], args: ['--ns'], defaultValues: ['42', 'string']},
    {
      key: 'ask',
      types: null,
      args: ['ask'],
      opts: [
        {key: 'question', types: ['string'], args: ['-q']},
        {key: 'jokingly', types: [], args: ['-j'], defaultValues: {type: 'flag', count: 1}}
      ],
      defaultValues: {jokingly: 'foo'}
    },
    {key: 'brisk', types: [], args: ['--brisk'], defaultValues: {type: 'flag', count: 1}},
  ]

  const {errs, args} = setDefaultValues({opts})

  const expArgs = {
    _: [],
    name: 'Logan',
    numStr: ['42', 'string'],
    ask: {
      jokingly: 'foo'
    },
    brisk: {type: 'flag', count: 1}
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('setDefaultValues reports an error if it has the wrong format', () => {
  const name     = {key: 'name', types: ['string'], args: ['--name'], defaultValues: []}
  const birthday = {key: 'birthday', types: ['string'], args: ['-b'], defaultValues: 'unknown'}

  const opts = [
    name,
    birthday,
    {
      key: 'ask',
      args: ['ask'],
      opts: [
        {key: 'question', types: ['string'], args: ['-q']},
        {key: 'jokingly', types: [], args: ['-j'], defaultValues: {type: 'flag', count: 1}
      }],
      defaultValues: {jokingly: 'foo'}
    }
  ]

  const {errs, args} = setDefaultValues({opts})

  const expArgs = {
    _: [],
    ask: {
      jokingly: 'foo'
    }
  }

  const expErrs = [
    invalidDefaultValues({defaultValues: [], option: name}),
    invalidDefaultValues({defaultValues: 'unknown', option: birthday})
  ]

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('setDefaultValues works if opts is undefined', () => {
  const obj = {}

  const {args} = setDefaultValues(obj)

  expect(args).toStrictEqual({_: []})
})

test('setDefaultValues works if input is undefined', () => {
  const {args} = setDefaultValues()

  expect(args).toStrictEqual({_: []})
})

test('setDefaultValues passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = setDefaultValues({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})