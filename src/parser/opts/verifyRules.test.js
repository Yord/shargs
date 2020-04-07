const verifyRules = require('./verifyRules')
const {falseRules, wrongRulesType} = require('../errors')

test('verifyRules README example works', () => {
  const rules = firstName => opts => (
    firstName.values[0] === 'Logan' ||
    opts.some(({key, values}) => key === 'lastName' && values)
  )

  const firstName = {key: 'firstName', types: ['string'], args: ['-f'], rules, values: ['Charles']}
  const lastName  = {key: 'lastName', types: ['string'], args: ['-l']}

  const obj = {
    opts: [firstName, lastName]
  }

  const {errs} = verifyRules(obj)

  const exp = [
    falseRules({key: 'firstName', rules, option: firstName})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyRules does not change anything if it passes', () => {
  const rules = firstName => opts => (
    firstName.values[0] === 'Logan' ||
    opts.some(({key, values}) => key === 'lastName' && values !== null)
  )

  const firstName = {key: 'firstName', types: ['string'], args: ['-f'], rules, values: ['Logan']}
  const lastName  = {key: 'lastName', types: ['string'], args: ['-l']}

  const obj = {
    opts: [firstName, lastName]
  }

  const {opts} = verifyRules(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('verifyRules fails on wrong type', () => {
  const rules = 42

  const firstName = {key: 'firstName', types: ['string'], args: ['-f'], rules, values: ['Charles']}
  const lastName  = {key: 'lastName', types: ['string'], args: ['-l']}

  const obj = {
    opts: [firstName, lastName]
  }

  const {errs} = verifyRules(obj)

  const exp = [
    wrongRulesType({key: 'firstName', type: 'number', option: firstName})
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