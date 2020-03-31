const broadenBools = require('./broadenBools')
const {array, bool, number} = require('../../options')

const numberBool = array(['number', 'bool'])

test('broadenBools README example works', () => {
  const obj = {
    opts: [
      {...number('answer', ['-a', '--answer']), values: ['42']},
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'yes']},
      {...bool('verbose', ['--verbose']), values: ['no']},
      {...bool('verbose', ['--verbose']), values: ['false']}
    ]
  }

  const alt = {
    true: ['yes'],
    false: ['no', 'f']
  }

  const {opts} = broadenBools(alt)(obj)

  const exp = [
    {...number('answer', ['-a', '--answer']), values: ['42']},
    {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']},
    {...bool('verbose', ['--verbose']), values: ['false']},
    {...bool('verbose', ['--verbose']), values: ['false']}
  ]

  expect(opts).toStrictEqual(exp)
})