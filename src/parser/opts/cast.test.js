const cast = require('./cast')
const {argumentIsNotABool, argumentIsNotANumber} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('cast README example works', () => {
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
    {...flag('version', ['--version']), values: []}
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

test('cast does not change flags', () => {
  const version = {...flag('version', ['--version']), values: []}

  const obj = {
    opts: [version]
  }

  const {opts} = cast(obj)

  const exp = [version]

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

test('cast reports an error on wrong bools', () => {
  const option = {...bool('verbose', ['--verbose']), values: ['foo']}

  const obj = {opts: [option]}

  const {errs} = cast(obj)

  const exp = [
    argumentIsNotABool({value: option.values[0], option})
  ]

  expect(errs).toStrictEqual(exp)
})

test('cast reports an error on wrong numbers', () => {
  const option = {...number('answer', ['-a', '--answer']), values: ['fourtytwo']}

  const obj = {opts: [option]}

  const {errs} = cast(obj)

  const exp = [
    argumentIsNotANumber({value: option.values[0], option})
  ]

  expect(errs).toStrictEqual(exp)
})

test('cast ignores all options with types it does not know', () => {
  const option = {key: 'foo', types: ['foo'], args: ['-a', '--answer'], values: ['42']}

  const obj = {opts: [option]}

  const {opts} = cast(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('cast works if opts is undefined', () => {
  const obj = {}

  const {opts} = cast(obj)

  expect(opts).toStrictEqual([])
})

test('cast works if input is undefined', () => {
  const {opts} = cast()

  expect(opts).toStrictEqual([])
})

test('cast passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = cast({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})