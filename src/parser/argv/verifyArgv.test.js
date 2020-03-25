const verifyArgv = require('./verifyArgv')
const {falseArgvRules, wrongArgvRulesType} = require('../../errors')

test('verifyArgv README example works', () => {
  const rules = argv => (
    argv.some(_ => _ === '-f') &&
    argv.some(_ => _ === '-l')
  )

  const argv = ['-f', 'Logan']

  const {errs} = verifyArgv(rules)({argv})

  const exp = [
    falseArgvRules({rules, argv})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyArgv README example works', () => {
  const rules = 42

  const argv = ['-f', 'Logan']

  const {errs} = verifyArgv(rules)({argv})

  const exp = [
    wrongArgvRulesType({type: 'number', argv})
  ]

  expect(errs).toStrictEqual(exp)
})