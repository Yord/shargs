const requireOptions = require('./requireOptions')
const {requiredOptionMissing} = require('../../errors')
const {number} = require('../../options')

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