const verifyRules = require('./verifyRules')
const {falseRules, wrongRulesType} = require('../../errors')
const {string} = require('../../options')

test('verifyRules README example works', () => {
  const rules = firstName => opts => (
    firstName.values[0] === 'Logan' ||
    opts.some(({key, values}) => key === 'lastName' && values !== null)
  )

  const firstName = string('firstName', ['-f'], {rules, values: ['Charles']})
  const lastName  = string('lastName', ['-l'])

  const obj = {
    opts: [firstName, lastName]
  }

  const {errs} = verifyRules(obj)

  const exp = [
    falseRules({rules, option: firstName})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyRules does not change anything if it passes', () => {
  const rules = firstName => opts => (
    firstName.values[0] === 'Logan' ||
    opts.some(({key, values}) => key === 'lastName' && values !== null)
  )

  const firstName = string('firstName', ['-f'], {rules, values: ['Logan']})
  const lastName  = string('lastName', ['-l'])

  const obj = {
    opts: [firstName, lastName]
  }

  const {opts} = verifyRules(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('verifyRules fails on wrong type', () => {
  const rules = 42

  const firstName = string('firstName', ['-f'], {rules, values: ['Charles']})
  const lastName  = string('lastName', ['-l'])

  const obj = {
    opts: [firstName, lastName]
  }

  const {errs} = verifyRules(obj)

  const exp = [
    wrongRulesType({type: 'number', option: firstName})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyRules works if opts is undefined', () => {
  const obj = {}

  const {opts} = verifyRules(obj)

  expect(opts).toStrictEqual([])
})

test('verifyRules works if input is undefined', () => {
  const {opts} = verifyRules()

  expect(opts).toStrictEqual([])
})

test('verifyRules passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = verifyRules({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})