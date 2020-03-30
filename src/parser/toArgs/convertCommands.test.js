const convertCommands         = require('./convertCommands')
const {command, flag, string} = require('../../options')
const parser                  = require('../combinators/parser')

const parsers = {__: parser(), _: parser()}

test('convertCommands works as expected', () => {
  const opts = [
    string('name', ['--name']),
    {
      ...command('ask', ['ask'], {
        opts: [
          string('question', ['-q']),
          flag('jokingly', ['-j'], {defaultValue: [1]})
        ]
      }),
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