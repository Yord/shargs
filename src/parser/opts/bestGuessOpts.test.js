const bestGuessOpts = require('./bestGuessOpts')

test('bestGuessOpts README example works', () => {
  const obj = {
    opts: [
      {key: 'age', types: ['string'], args: [], values: ['unknown']},
      {values: ['--angry']},
      {values: ['--name']},
      {values: ['Logan']},
      {values: ['foo']}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = [
    {key: 'age', types: ['string'], args: [], values: ['unknown']},
    {key: 'angry', types: [], args: [], values: [1]},
    {key: 'name', types: ['string'], args: [], values: ['Logan']},
    {values: ['foo']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('bestGuessOpts does not override existing keys', () => {
  const obj = {
    opts: [
      {key: 'name', types: ['string'], args: [], values: ['Charles']},
      {values: ['--name']},
      {values: ['Logan']}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('bestGuessOpts does not interpret short options that are too long', () => {
  const obj = {
    opts: [
      {key: 'name', types: ['string'], args: [], values: ['Charles']},
      {values: ['-name']},
      {values: ['Logan']}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('bestGuessOpts does work despite getting nonsensical input', () => {
  const obj = {
    opts: [
      {key: 'name', types: ['string'], args: [], values: ['Charles']},
      {values: ['--foo']},
      {values: [42]},
      {values: ['-f']},
      {values: [1]},
      {values: ['-h']},
      {values: [{foo: 42}]}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = [
    {key: 'name', types: ['string'], args: [], values: ['Charles']},
    {key: 'foo', types: [], args: [], values: [1]},
    {values: [42]},
    {key: 'f', types: [], args: [], values: [1]},
    {values: [1]},
    {key: 'h', types: [], args: [], values: [1]},
    {values: [{foo: 42}]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('bestGuessOpts works if opts is undefined', () => {
  const obj = {}

  const {opts} = bestGuessOpts(obj)

  expect(opts).toStrictEqual([])
})

test('bestGuessOpts works if input is undefined', () => {
  const {opts} = bestGuessOpts()

  expect(opts).toStrictEqual([])
})

test('bestGuessOpts passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = bestGuessOpts({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})