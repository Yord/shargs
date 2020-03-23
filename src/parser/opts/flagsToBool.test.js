const flagsToBool = require('./flagsToBool')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('flagsToBool works as expected on all types', () => {
  const versionCount = {...flag('version', ['--version']), values: {count: 1}}
  const versionBool = {...flag('version', ['--version']), values: [true]}

  const obj = version => ({
    opts: [
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
      {...number('answer', ['-a', '--answer']), values: [42]},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: [false]},
      version
    ]
  })

  const {opts} = flagsToBool(obj(versionCount))

  const exp = obj(versionBool).opts

  expect(opts).toStrictEqual(exp)
})