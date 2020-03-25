const verifyValuesArity = require('./verifyValuesArity')
const {invalidArity} = require('../../errors')
const {string} = require('../../options')

test('verifyValuesArity README example works', () => {
  const name = string('name', ['--name'], {values: ['Charles', 'Francis']})
  const opts = [name]

  const {errs} = verifyValuesArity({opts})

  const exp = [
    invalidArity({option: name})
  ]

  expect(errs).toStrictEqual(exp)
})