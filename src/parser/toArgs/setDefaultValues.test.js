const setDefaultValues   = require('./setDefaultValues')
const {command, flag, string} = require('../../options')

test('setDefaultValues works as expected', () => {
  const opts = [
    string('name', ['--name'], {defaultValues: ['Logan']}),
    command('ask', ['ask'], {
      opts: [string('question', ['-q']), flag('jokingly', ['-j'], {defaultValues: [1]})],
      defaultValues: {jokingly: true}
    })
  ]

  const {errs, args} = setDefaultValues({opts})

  const expArgs = {
    _: [],
    name: 'Logan',
    ask: {
      jokingly: true
    }
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('setDefaultValues works if opts is undefined', () => {
  const obj = {}

  const {args} = setDefaultValues(obj)

  expect(args).toStrictEqual({_: []})
})