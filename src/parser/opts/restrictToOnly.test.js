const restrictToOnly = require('./restrictToOnly')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('restrictToOnly works as expected on all types', () => {
  const obj = {
    opts: [
      {...string('title', ['--title'], {only: ["The Hitchhiker's Guide to the Galaxy"]}), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb'], {only: [23, true]}), values: [23, true]},
      {...number('answer', ['-a', '--answer'], {only: [42]}), values: [42]},
      {...command('help', ['-h', '--help'], {only: ['foo --bar']}), values: ['foo --bar']},
      {...bool('verbose', ['--verbose'], {only: [false]}), values: [false]},
      {...flag('version', ['--version'], {only: [true]}), values: [true]}
    ]
  }

  const {opts} = restrictToOnly(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})