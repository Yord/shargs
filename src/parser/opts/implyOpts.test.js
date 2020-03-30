const implyOpts = require('./implyOpts')
const {implicationViolated, wrongImpliesType} = require('../../errors')
const {number, string} = require('../../options')

test('implyOpts README example works', () => {
  const age      = {...number('age', ['-a'], {implies: ['birthday']}), values: ['27']}
  const birthday = string('birthday', ['-b'], {implies: ['age']})

  const obj = {
    opts: [age, birthday]
  }

  const {errs} = implyOpts(obj)

  const exp = [
    implicationViolated({key: 'age', implies: ['birthday'], option: age})
  ]

  expect(errs).toStrictEqual(exp)
})

test('implyOpts works on default values', () => {
  const age      = number('age', ['-a'], {implies: ['birthday'], defaultValues: ['27']})
  const birthday = string('birthday', ['-b'], {implies: ['age']})

  const obj = {
    opts: [age, birthday]
  }

  const {errs} = implyOpts(obj)

  const exp = [
    implicationViolated({key: 'age', implies: ['birthday'], option: age})
  ]

  expect(errs).toStrictEqual(exp)
})

test('implyOpts does not change anything if it passes', () => {
  const age      = {...number('age', ['-a'], {contradicts: ['birthday']}), values: ['27']}
  const birthday = {...string('birthday', ['-b'], {contradicts: ['age']}), values: ['27.7.1927']}

  const obj = {
    opts: [age, birthday]
  }

  const {opts} = implyOpts(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})