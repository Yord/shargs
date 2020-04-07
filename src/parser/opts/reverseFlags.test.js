const reverseFlags = require('./reverseFlags')

test('reverseFlags README example works', () => {
  const obj = {
    opts: [
      {key: 'flag', types: [], args: ['-f'], reverse: true, values: [1]}
    ]
  }

  const {opts} = reverseFlags(obj)

  const exp = [
    {key: 'flag', types: [], args: ['-f'], reverse: true, values: [-1]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseFlags does not change booleans', () => {
  const obj = {
    opts: [
      {key: 'flag', types: [], args: ['-f'], reverse: true, values: [1]},
      {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: [true]}
    ]
  }

  const {opts} = reverseFlags(obj)

  const exp = [
    {key: 'flag', types: [], args: ['-f'], reverse: true, values: [-1]},
    {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: [true]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseFlags does not reverse flags without values', () => {
  const obj = {
    opts: [
      {key: 'flag', types: [], args: ['-f'], reverse: true, values: [1]},
      {key: 'flag2', types: [], args: ['--f2'], reverse: true, values: null}
    ]
  }

  const {opts} = reverseFlags(obj)

  const exp = [
    {key: 'flag', types: [], args: ['-f'], reverse: true, values: [-1]},
    {key: 'flag2', types: [], args: ['--f2'], reverse: true, values: null}
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseFlags works if opts is undefined', () => {
  const obj = {}

  const {errs} = reverseFlags(obj)

  expect(errs).toStrictEqual([])
})

test('reverseFlags works if input is undefined', () => {
  const {errs} = reverseFlags()

  expect(errs).toStrictEqual([])
})

test('reverseFlags passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = reverseFlags({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})