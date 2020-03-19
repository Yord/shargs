const cast = require('./cast')
const {argumentIsNotABool, argumentIsNotANumber} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('cast casts values into their types', () => {
  const obj = {
    opts: [
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']},
      {...number('answer', ['-a', '--answer']), values: ['42']},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: ['false']},
      {...flag('version', ['--version']), values: []}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
    {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
    {...number('answer', ['-a', '--answer']), values: [42]},
    {...command('help', ['-h', '--help']), values: ['foo --bar']},
    {...bool('verbose', ['--verbose']), values: [false]},
    {...flag('version', ['--version']), values: [true]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast does not cast strings', () => {
  const obj = {
    opts: [
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts numbers', () => {
  const obj = {
    opts: [
      {...number('answer', ['-a', '--answer']), values: ['42']}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...number('answer', ['-a', '--answer']), values: [42]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast does not change commands', () => {
  const obj = {
    opts: [
      {...command('help', ['-h', '--help']), values: ['foo --bar']}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...command('help', ['-h', '--help']), values: ['foo --bar']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts bools', () => {
  const obj = {
    opts: [
      {...bool('verbose', ['--verbose']), values: ['false']}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...bool('verbose', ['--verbose']), values: [false]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts flags', () => {
  const obj = {
    opts: [
      {...flag('version', ['--version']), values: []}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...flag('version', ['--version']), values: [true]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts arrays', () => {
  const obj = {
    opts: [
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...numberBool('numBool', ['-n', '--nb']), values: [23, true]}
  ]

  expect(opts).toStrictEqual(exp)
})