const verifyArgs = require('./verifyArgs')
const {falseArgsRules, wrongArgsRulesType} = require('../../errors')

test('verifyArgs README example works', () => {
  const rules = args => (
    typeof args.firstName !== 'undefined',
    typeof args.lastName  !== 'undefined'
  )

  const args = {
    firstName: 'Logan'
  }

  const {errs} = verifyArgs(rules)({args})

  const exp = [
    falseArgsRules({rules, args})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyArgs README example works', () => {
  const rules = 42

  const args = {
    firstName: 'Logan'
  }

  const {errs} = verifyArgs(rules)({args})

  const exp = [
    wrongArgsRulesType({type: 'number', args})
  ]

  expect(errs).toStrictEqual(exp)
})