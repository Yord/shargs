const reverseBools = require('./reverseBools')

test('reverseBools README example works', () => {
  const obj = {
    opts: [
      {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: [true]},
      {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: ['true']}
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: [false]},
    {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: ['false']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBools works as expected', () => {
  const obj = {
    opts: [
      {key: 'bool1', types: ['bool'], args: ['-b'], reverse: true, values: [true]},
      {key: 'bool2', types: ['bool'], args: ['-b'], reverse: true, values: [false]},
      {key: 'bool3', types: ['bool'], args: ['-b'], reverse: true, values: ['true']},
      {key: 'bool4', types: ['bool'], args: ['-b'], reverse: true, values: ['false']},
      {key: 'bool5', types: ['bool'], args: ['-b'], reverse: true, values: [42]},
      {key: 'bool6', types: ['bool'], args: ['-b'], reverse: true, values: [null]},
      {key: 'bool7', types: ['bool'], args: ['-b'], reverse: true, values: [undefined]},
      {key: 'bool8', types: ['bool'], args: ['-b'], reverse: true, values: [[42]]},
      {key: 'bool9', types: ['bool'], args: ['-b'], reverse: true, values: [{}]}
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    {key: 'bool1', types: ['bool'], args: ['-b'], reverse: true, values: [false]},
    {key: 'bool2', types: ['bool'], args: ['-b'], reverse: true, values: [true]},
    {key: 'bool3', types: ['bool'], args: ['-b'], reverse: true, values: ['false']},
    {key: 'bool4', types: ['bool'], args: ['-b'], reverse: true, values: ['true']},
    {key: 'bool5', types: ['bool'], args: ['-b'], reverse: true, values: [42]},
    {key: 'bool6', types: ['bool'], args: ['-b'], reverse: true, values: [null]},
    {key: 'bool7', types: ['bool'], args: ['-b'], reverse: true, values: [undefined]},
    {key: 'bool8', types: ['bool'], args: ['-b'], reverse: true, values: [[42]]},
    {key: 'bool9', types: ['bool'], args: ['-b'], reverse: true, values: [{}]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBools does not change flags', () => {
  const obj = {
    opts: [
      {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: [true]},
      {key: 'flag', types: [], args: ['-f'], reverse: true, values: [1]}
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: [false]},
    {key: 'flag', types: [], args: ['-f'], reverse: true, values: [1]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBools does not change bool options with invalid values', () => {
  const obj = {
    opts: [
      {key: 'bool1', types: ['bool'], args: ['-b'], reverse: true, values: [42]},
      {key: 'bool2', types: ['bool'], args: ['-b'], reverse: true, values: ['42']},
      {key: 'bool2', types: ['bool'], args: ['-b'], reverse: true, values: [undefined]},
      {key: 'bool2', types: ['bool'], args: ['-b'], reverse: true, values: [null]}
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    {key: 'bool1', types: ['bool'], args: ['-b'], reverse: true, values: [42]},
    {key: 'bool2', types: ['bool'], args: ['-b'], reverse: true, values: ['42']},
    {key: 'bool2', types: ['bool'], args: ['-b'], reverse: true, values: [undefined]},
    {key: 'bool2', types: ['bool'], args: ['-b'], reverse: true, values: [null]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('reverseBools does not reverse booleans without values', () => {
  const obj = {
    opts: [
      {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: [true]},
      {key: 'bool2', types: ['bool'], args: ['--b2'], reverse: true, values: null}
    ]
  }

  const {opts} = reverseBools(obj)

  const exp = [
    {key: 'bool', types: ['bool'], args: ['-b'], reverse: true, values: [false]},
    {key: 'bool2', types: ['bool'], args: ['--b2'], reverse: true, values: null}
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