const verifyArgs = require('./verifyArgs')
const {falseArgsRules, wrongArgsRulesType} = require('../errors')

test('verifyArgs README example works', () => {
  const rules = args => (
    typeof args.firstName !== 'undefined' &&
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

test('verifyArgs works if opts is undefined', () => {
  const obj = {}

  const {args} = verifyArgs()(obj)

  expect(args).toStrictEqual([])
})

test('verifyArgs works if input is undefined', () => {
  const {args} = verifyArgs()()

  expect(args).toStrictEqual([])
})

test('verifyArgs passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = verifyArgs()({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})