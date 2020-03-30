const contradictOpts = require('./contradictOpts')
const {contradictionDetected, wrongContradictsType} = require('../../errors')
const {number, string} = require('../../options')

test('contradictOpts README example works', () => {
  const age      = {...number('age', ['-a'], {contradicts: ['birthday']}), values: ['27']}
  const birthday = {...string('birthday', ['-b'], {contradicts: ['age']}), values: ['27.7.1927']}

  const obj = {
    opts: [age, birthday]
  }

  const {errs} = contradictOpts(obj)

  const exp = [
    contradictionDetected({key: 'age', contradicts: ['birthday'], option: age}),
    contradictionDetected({key: 'birthday', contradicts: ['age'], option: birthday})
  ]

  expect(errs).toStrictEqual(exp)
})