const bestGuessOpts = require('./bestGuessOpts')
const {flag, string} = require('../../options')

const noArgs = ({args, ...rest}) => rest

test('bestGuessOpts README example works', () => {
  const obj = {
    opts: [
      noArgs(string('age', ['--age'], {values: ['unknown']})),
      {values: ['--angry']},
      {values: ['--name']},
      {values: ['Logan']},
      {values: ['foo']}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = [
    noArgs(string('age', ['--age'], {values: ['unknown']})),
    noArgs(flag('angry', [], {values: [1]})),
    noArgs(string('name', [], {values: ['Logan']})),
    {values: ['foo']}
  ]

  expect(opts).toStrictEqual(exp)
})