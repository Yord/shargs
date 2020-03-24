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