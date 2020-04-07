const suggestOptions = require('./suggestOptions')
const {didYouMean} = require('../errors')

test('suggestOptions README example works', () => {
  const age = {key: 'age', types: ['number'], args: ['-a', '--age']}

  const opts = [
    age,
    {values: ['--aeg']}
  ]

  const {errs} = suggestOptions({opts})

  const exp = [
    didYouMean({
      argv: '--aeg',
      options: [
        [],
        [],
        [{'--age': age}],
        [{'-a': age}]
      ]
    })
  ]

  expect(errs).toStrictEqual(exp)
})

test('suggestOptions works as expected', () => {
  const argv1 = '--titel'
  const argv2 = '--titl'
  const argv3 = '--beer'
  const title = {key: 'title', types: ['string'], args: ['-t', '--title']}
  const age   = {key: 'age', types: ['number'], args: ['--age', '-a']}
  const beef  = {key: 'age', types: ['bool'], args: ['--beef', '-b']}

  const opts = [
    beef,
    {values: [argv1]},
    title,
    {values: [argv2]},
    {values: [argv3]},
    age
  ]

  const {errs} = suggestOptions({opts})

  const exp = [
    didYouMean({
      argv: argv1,
      options: [
        [],
        [],
        [{'--title': title}],
        [],
        [{'--beef': beef}, {'--age': age}],
        [{'-t': title}],
        [{'-b': beef}, {'-a': age}]
      ]
    }),
    didYouMean({
      argv: argv2,
      options: [
        [],
        [{'--title': title}],
        [],
        [],
        [{'--beef': beef}, {'-t': title}, {'--age': age}],
        [{'-b': beef}, {'-a': age}]
      ]
    }),
    didYouMean({
      argv: argv3,
      options: [
        [],
        [{'--beef': beef}],
        [],
        [{'--age': age}],
        [{'-b': beef}],
        [{'-t': title}, {'--title': title}, {'-a': age}]
      ]
    })
  ]

  expect(errs).toStrictEqual(exp)
})

test('suggestOptions works if opts is undefined', () => {
  const obj = {}

  const {opts} = suggestOptions(obj)

  expect(opts).toStrictEqual([])
})

test('suggestOptions works if input is undefined', () => {
  const {opts} = suggestOptions()

  expect(opts).toStrictEqual([])
})

test('suggestOptions passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = suggestOptions({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})