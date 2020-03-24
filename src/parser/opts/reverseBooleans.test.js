const reverseBooleans = require('./reverseBooleans')
const {bool, flag} = require('../../options')

test('reverseBooleans README example works', () => {
  const obj = {
    opts: [
      bool('bool', ['-b'], {reverse: true, values: [true]})
    ]
  }

  const {opts} = reverseBooleans(obj)

  const exp = [
    bool('bool', ['-b'], {reverse: true, values: [false]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBooleans does not change flags', () => {
  const obj = {
    opts: [
      bool('bool', ['-b'], {reverse: true, values: [true]}),
      flag('flag', ['-f'], {reverse: true, values: [1]})
    ]
  }

  const {opts} = reverseBooleans(obj)

  const exp = [
    bool('bool', ['-b'], {reverse: true, values: [false]}),
    flag('flag', ['-f'], {reverse: true, values: [1]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBooleans does not reverse booleans without values', () => {
  const obj = {
    opts: [
      bool('bool', ['-b'], {reverse: true, values: [true]}),
      bool('bool2', ['--b2'], {reverse: true, values: null})
    ]
  }

  const {opts} = reverseBooleans(obj)

  const exp = [
    bool('bool', ['-b'], {reverse: true, values: [false]}),
    bool('bool2', ['--b2'], {reverse: true, values: null})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBooleans works if opts is undefined', () => {
  const obj = {}

  const {errs} = reverseBooleans(obj)

  expect(errs).toStrictEqual([])
})