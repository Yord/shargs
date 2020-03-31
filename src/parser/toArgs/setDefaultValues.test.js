const setDefaultValues   = require('./setDefaultValues')
const {array, command, flag, string} = require('../../options')
const {invalidDefaultValues} = require('../../errors')

const numStr = array(['number', 'string'])

test('setDefaultValues works as expected', () => {
  const opts = [
    string('name', ['--name'], {defaultValues: ['Logan']}),
    numStr('numStr', ['--ns'], {defaultValues: ['42', 'string']}),
    command('ask', ['ask'], {
      opts: [string('question', ['-q']), flag('jokingly', ['-j'], {defaultValues: [1]})],
      defaultValues: {jokingly: true}
    })
  ]

  const {errs, args} = setDefaultValues({opts})

  const expArgs = {
    _: [],
    name: 'Logan',
    numStr: ['42', 'string'],
    ask: {
      jokingly: true
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('setDefaultValues reports an error if it has the wrong format', () => {
  const name     = string('name', ['--name'], {defaultValues: []})
  const birthday = string('birthday', ['-b'], {defaultValues: 'unknown'})

  const opts = [
    name,
    birthday,
    command('ask', ['ask'], {
      opts: [string('question', ['-q']), flag('jokingly', ['-j'], {defaultValues: [1]})],
      defaultValues: {jokingly: true}
    })
  ]

  const {errs, args} = setDefaultValues({opts})

  const expArgs = {
    _: [],
    ask: {
      jokingly: true
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