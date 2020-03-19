const restrictToOnly = require('./restrictToOnly')
const {argumentValueRestrictionsViolated} = require('../../errors')
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

test('restrictToOnly does nothing if the only attribute is undefined or null', () => {
  const obj = {
    opts: [
      {...string('title', ['--title'], {only: null}), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb'], {only: null}), values: [23, true]},
      {...number('answer', ['-a', '--answer'], {only: null}), values: [42]},
      {...command('help', ['-h', '--help'], {only: null}), values: ['foo --bar']},
      {...bool('verbose', ['--verbose'], {only: null}), values: [false]},
      {...flag('version', ['--version'], {only: null}), values: [true]},
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
      {...number('answer', ['-a', '--answer']), values: [42]},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: [false]},
      {...flag('version', ['--version']), values: [true]}
    ]
  }

  const {opts} = restrictToOnly(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('restrictToOnly fails if a value is not allowed', () => {
  const obj = {
    opts: [
      {...string('title', ['--title'], {only: ["Dirk Gently"]}), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...number('answer', ['-a', '--answer'], {only: [23]}), values: [42]},
      {...command('help', ['-h', '--help'], {only: ['--foo bar']}), values: ['foo --bar']},
      {...bool('verbose', ['--verbose'], {only: [true]}), values: [false]},
      {...flag('version', ['--version'], {only: [false]}), values: [true]}
    ]
  }

  const {errs} = restrictToOnly(obj)

  const exp = obj.opts.map(option => argumentValueRestrictionsViolated({
    value: option.values[0],
    only: option.only,
    option
  }))

  expect(errs).toStrictEqual(exp)
})