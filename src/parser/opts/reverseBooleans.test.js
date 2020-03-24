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