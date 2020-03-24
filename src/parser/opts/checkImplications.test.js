const checkImplications = require('./checkImplications')
const {falseImplication, wrongImplicationType} = require('../../errors')
const {string} = require('../../options')

test('checkImplications README example works', () => {
  const implies = firstName => opts => (
    firstName.values[0] === 'Logan' ||
    opts.some(({key, values}) => key === 'lastName' && values !== null)
  )

  const firstName = string('firstName', ['-f'], {implies, values: ['Charles']})
  const lastName  = string('lastName', ['-l'])

  const obj = {
    opts: [firstName, lastName]
  }

  const {errs} = checkImplications(obj)

  const exp = [
    falseImplication({implies, option: firstName})
  ]

  expect(errs).toStrictEqual(exp)
})

test('checkImplications fails on wrong type', () => {
  const implies = 42

  const firstName = string('firstName', ['-f'], {implies, values: ['Charles']})
  const lastName  = string('lastName', ['-l'])

  const obj = {
    opts: [firstName, lastName]
  }

  const {errs} = checkImplications(obj)

  const exp = [
    wrongImplicationType({type: 'number', option: firstName})
  ]

  expect(errs).toStrictEqual(exp)
})

test('checkImplications works if opts is undefined', () => {
  const obj = {}

  const {opts} = checkImplications(obj)

  expect(opts).toStrictEqual([])
})

test('checkImplications works if input is undefined', () => {
  const {opts} = checkImplications()

  expect(opts).toStrictEqual([])
})