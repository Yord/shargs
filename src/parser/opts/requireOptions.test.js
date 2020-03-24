const requireOptions = require('./requireOptions')
const {requiredOptionFormat, requiredOptionMissing} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('requireOptions README example works', () => {
  const answer = number('answer', ['-a', '--answer'], {required: true})

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
  const answer = number('answer', ['-a', '--answer'], {required: true})
  const question = number('question', ['-q', '--question'], {required: true, values: ['Are default values fine?']})

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
      string('title', ['--title'], {required: true}),
      numberBool('numBool', ['-n', '--nb'], {required: true}),
      number('answer', ['-a', '--answer'], {required: true}),
      command('help', ['-h', '--help'], {required: true}),
      bool('verbose', ['--verbose'], {required: true}),
      flag('version', ['--version'], {required: true})
    ]
  }

  const {errs} = requireOptions(obj)

  const exp = obj.opts.map(option =>
    requiredOptionMissing({key: option.key, args: option.args, option})
  )

  expect(errs).toStrictEqual(exp)
})

test('requireOptions works if required is false', () => {
  const answer = number('answer', ['-a', '--answer'], {required: false})

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
  const answer = number('answer', ['-a', '--answer'])

  const obj = {
    opts: [answer]
  }

  const {errs, opts} = requireOptions(obj)

  const expErrs = []

  const expOpts = obj.opts

  expect(errs).toStrictEqual(expErrs)
  expect(opts).toStrictEqual(expOpts)
})