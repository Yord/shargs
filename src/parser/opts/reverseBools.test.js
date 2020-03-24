const reverseBools = require('./reverseBools')
const {bool, flag} = require('../../options')

test('reverseBools README example works', () => {
  const obj = {
    opts: [
      bool('bool', ['-b'], {reverse: true, values: [true]})
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    bool('bool', ['-b'], {reverse: true, values: [false]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBools does not change flags', () => {
  const obj = {
    opts: [
      bool('bool', ['-b'], {reverse: true, values: [true]}),
      flag('flag', ['-f'], {reverse: true, values: [1]})
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    bool('bool', ['-b'], {reverse: true, values: [false]}),
    flag('flag', ['-f'], {reverse: true, values: [1]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBools does not reverse booleans without values', () => {
  const obj = {
    opts: [
      bool('bool', ['-b'], {reverse: true, values: [true]}),
      bool('bool2', ['--b2'], {reverse: true, values: null})
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    bool('bool', ['-b'], {reverse: true, values: [false]}),
    bool('bool2', ['--b2'], {reverse: true, values: null})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBools works if opts is undefined', () => {
  const obj = {}

  const {errs} = reverseBools(obj)

  expect(errs).toStrictEqual([])
})

test('reverseBools works if input is undefined', () => {
  const {errs} = reverseBools()

  expect(errs).toStrictEqual([])
})

test('reverseBools passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = reverseBools({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})