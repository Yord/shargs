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

test('reverseFlags does not change booleans', () => {
  const obj = {
    opts: [
      flag('flag', ['-f'], {reverse: true, values: [1]}),
      bool('bool', ['-b'], {reverse: true, values: [true]})
    ]
  }

  const {opts} = reverseFlags(obj)

  const exp = [
    flag('flag', ['-f'], {reverse: true, values: [-1]}),
    bool('bool', ['-b'], {reverse: true, values: [true]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseFlags does not reverse flags without values', () => {
  const obj = {
    opts: [
      flag('flag', ['-f'], {reverse: true, values: [1]}),
      flag('flag2', ['--f2'], {reverse: true, values: null})
    ]
  }

  const {opts} = reverseFlags(obj)

  const exp = [
    flag('flag', ['-f'], {reverse: true, values: [-1]}),
    flag('flag2', ['--f2'], {reverse: true, values: null})
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseFlags works if opts is undefined', () => {
  const obj = {}

  const {errs} = reverseFlags(obj)

  expect(errs).toStrictEqual([])
})