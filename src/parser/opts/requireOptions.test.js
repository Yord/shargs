const requireOptions = require('./requireOptions')
const {requiredOptionMissing} = require('../../errors')
const {number} = require('../../options')


test('requireOptions README example works', () => {
  const answer = number('answer', ['-a', '--answer'], {required: true})

  const obj = {
    opts: [answer]
  }

  const {errs, opts} = requireOptions(obj)

  const expErrs = [
    requiredOptionMissing({key: answer.key, args: answer.args, option: answer})
  ]

  expect(errs).toStrictEqual(expErrs)
})