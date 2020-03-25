const verifyOpts = require('./verifyOpts')
const {falseOptsRules, wrongOptsRulesType} = require('../../errors')
const {string} = require('../../options')

test('verifyOpts README example works', () => {
  const implies = (p, q) => !p || q

  const rules = opts => implies(
    opts.some(({key, values}) => key === 'firstName' && values !== null),
    opts.some(({key, values}) => key === 'lastName' && values !== null)
  )

  const opts = [
    string('firstName', ['-f'], {values: ['Logan']}),
    string('lastName', ['-l'])
  ]

  const {errs} = verifyOpts(rules)({opts})

  const exp = [
    falseOptsRules({rules, options: opts})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyOpts fails on wrong type', () => {
  const rules = 42

  const opts = [
    string('firstName', ['-f'], {values: ['Logan']}),
    string('lastName', ['-l'])
  ]

  const {errs} = verifyOpts(rules)({opts})

  const exp = [
    wrongOptsRulesType({type: 'number', options: opts})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyOpts works if opts is undefined', () => {
  const obj = {}

  const {opts} = verifyOpts()(obj)

  expect(opts).toStrictEqual([])
})

test('verifyOpts works if input is undefined', () => {
  const {opts} = verifyOpts()()

  expect(opts).toStrictEqual([])
})

test('verifyOpts passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = verifyOpts()({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})