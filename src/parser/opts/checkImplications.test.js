const checkImplications = require('./checkImplications')
const {falseImplication} = require('../../errors')
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