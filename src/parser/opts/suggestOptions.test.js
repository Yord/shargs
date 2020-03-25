const suggestOptions = require('./suggestOptions')
const {didYouMean} = require('../../errors')
const {number} = require('../../options')

test('suggestOptions README example works', () => {
  const age = number('age', ['-a', '--age'])

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