const toArgs = require('./index')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

const discard = () => () => ({
  args: {discarded: true}
})

test('toArgs transforms opts into args', () => {
  const obj = {
    opts: [
      {values: ['foo']},
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
      {...number('answer', ['-a', '--answer']), values: [42]},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: [false]},
      {...flag('version', ['--version']), values: [true]},
      {values: ['bar']}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: ['foo', 'bar'],
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    answer: 42,
    help: {discarded: true},
    verbose: false,
    version: {count: 1}
  }

  expect(args).toStrictEqual(exp)
})