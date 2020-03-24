const reverseFlags = require('./reverseFlags')
const {bool, flag} = require('../../options')

test('reverseFlags README example works', () => {
  const obj = {
    opts: [
      flag('flag', ['-f'], {reverse: true, values: [1]})
    ]
  }

  const {opts} = reverseFlags(obj)

  const exp = [
    flag('flag', ['-f'], {reverse: true, values: [-1]})
  ]

  expect(opts).toStrictEqual(exp)
})