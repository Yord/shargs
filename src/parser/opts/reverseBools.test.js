const reverseBools = require('./reverseBools')
const {bool, flag} = require('../../options')

test('reverseBools README example works', () => {
  const obj = {
    opts: [
      bool('bool', ['-b'], {reverse: true, values: [true]}),
      bool('bool', ['-b'], {reverse: true, values: ['true']})
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    bool('bool', ['-b'], {reverse: true, values: [false]}),
    bool('bool', ['-b'], {reverse: true, values: ['false']})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBools works as expected', () => {
  const obj = {
    opts: [
      bool('bool1', ['-b'], {reverse: true, values: [true]}),
      bool('bool2', ['-b'], {reverse: true, values: [false]}),
      bool('bool3', ['-b'], {reverse: true, values: ['true']}),
      bool('bool4', ['-b'], {reverse: true, values: ['false']}),
      bool('bool5', ['-b'], {reverse: true, values: [42]}),
      bool('bool6', ['-b'], {reverse: true, values: [null]}),
      bool('bool7', ['-b'], {reverse: true, values: [undefined]}),
      bool('bool8', ['-b'], {reverse: true, values: [[42]]}),
      bool('bool9', ['-b'], {reverse: true, values: [{}]})
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    bool('bool1', ['-b'], {reverse: true, values: [false]}),
    bool('bool2', ['-b'], {reverse: true, values: [true]}),
    bool('bool3', ['-b'], {reverse: true, values: ['false']}),
    bool('bool4', ['-b'], {reverse: true, values: ['true']}),
    bool('bool5', ['-b'], {reverse: true, values: [42]}),
    bool('bool6', ['-b'], {reverse: true, values: [null]}),
    bool('bool7', ['-b'], {reverse: true, values: [undefined]}),
    bool('bool8', ['-b'], {reverse: true, values: [[42]]}),
    bool('bool9', ['-b'], {reverse: true, values: [{}]})
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

test('reverseBools does not change bool options with invalid values', () => {
  const obj = {
    opts: [
      bool('bool1', ['-b'], {reverse: true, values: [42]}),
      bool('bool2', ['-b'], {reverse: true, values: ['42']}),
      bool('bool2', ['-b'], {reverse: true, values: [undefined]}),
      bool('bool2', ['-b'], {reverse: true, values: [null]})
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    bool('bool1', ['-b'], {reverse: true, values: [42]}),
    bool('bool2', ['-b'], {reverse: true, values: ['42']}),
    bool('bool2', ['-b'], {reverse: true, values: [undefined]}),
    bool('bool2', ['-b'], {reverse: true, values: [null]})
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