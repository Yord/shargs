const convertNonCommands = require('./convertNonCommands')
const {command, flag, string} = require('../../options')

test('convertNonCommands works as expected', () => {
  const name     = {...string('name', ['--name']), values: ['Logan']}
  const question = {...string('question', ['-q']), values: ["What's your lastname?"]}
  const jokingly = flag('jokingly', ['-j'], {defaultValue: [1]})
  const ask      = {...command('ask', ['ask'], {opts: [question, jokingly]})}
  const opts     = [ask, name]

  const {errs, args} = convertNonCommands({opts})

  const expArgs = {
    _: [],
    name: 'Logan'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})