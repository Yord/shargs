const contradictOpts = require('./contradictOpts')
const {contradictionDetected, wrongContradictsType} = require('../errors')

test('contradictOpts README example works', () => {
  const age      = {key: 'age', types: ['number'], args: ['-a'], contradicts: ['birthday'], values: ['27']}
  const birthday = {key: 'birthday', types: ['string'], args: ['-b'], contradicts: ['age'], values: ['27.7.1927']}

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

test('contradictOpts works on default values', () => {
  const age      = {key: 'age', types: ['number'], args: ['-a'], contradicts: ['birthday'], values: ['27']}
  const birthday = {key: 'birthday', types: ['string'], args: ['-b'], contradicts: ['age'], values: ['27.7.1927']}

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

test('contradictOpts does not change anything if it passes', () => {
  const age      = {key: 'age', types: ['number'], args: ['-a'], contradicts: ['birthday'], values: ['27']}
  const birthday = {key: 'birthday', types: ['string'], args: ['-b'], contradicts: ['age']}

  const obj = {
    opts: [age, birthday]
  }

  const {opts} = contradictOpts(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('contradictOpts fails on wrong type', () => {
  const age      = {key: 'age', types: ['number'], args: ['-a'], contradicts: 'birthday', values: ['27']}
  const birthday = {key: 'birthday', types: ['string'], args: ['-b'], contradicts: ['age']}

  const obj = {
    opts: [age, birthday]
  }

  const {errs} = contradictOpts(obj)

  const exp = [
    wrongContradictsType({key: 'age', type: 'string', option: age})
  ]

  expect(errs).toStrictEqual(exp)
})

test('contradictOpts works if opts is undefined', () => {
  const obj = {}

  const {opts} = contradictOpts(obj)

  expect(opts).toStrictEqual([])
})

test('contradictOpts works if input is undefined', () => {
  const {opts} = contradictOpts()

  expect(opts).toStrictEqual([])
})

test('contradictOpts passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = contradictOpts({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})