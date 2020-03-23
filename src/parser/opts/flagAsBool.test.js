const flagAsBool = require('./flagAsBool')
const {array, bool, command, flag, number, string} = require('../../options')
const {flagIsNotACount} = require('../../errors')

const numberBool = array(['number', 'bool'])

test('flagAsBool README example works', () => {
  const obj = {
    opts: [
      {...flag('version', ['--version']), values: {count: 1}}
    ]
  }

  const {opts} = flagAsBool(obj)

  const exp = [{...flag('version', ['--version']), values: [true]}]

  expect(opts).toStrictEqual(exp)
})

test('flagAsBool works as expected on all types', () => {
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

  const {opts} = flagAsBool(obj(versionCount))

  const exp = obj(versionBool).opts

  expect(opts).toStrictEqual(exp)
})

test('flagAsBool reports an error if a flag is not a count', () => {
  const versionBool = {...flag('version', ['--version']), values: [true]}

  const obj = version => ({
    opts: [
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
      {...number('answer', ['-a', '--answer']), values: [42]},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: [false]},
      ...(typeof version === 'undefined' ? [] : [version])
    ]
  })

  const {errs, opts} = flagAsBool(obj(versionBool))

  const expOpts = obj().opts
  const expErrs = [
    flagIsNotACount({key: versionBool.key, types: versionBool.types, option: versionBool})
  ]

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})

test('flagAsBool works if opts is undefined', () => {
  const obj = {}

  const {opts} = flagAsBool(obj)

  expect(opts).toStrictEqual([])
})

test('flagAsBool works if input is undefined', () => {
  const {opts} = flagAsBool()

  expect(opts).toStrictEqual([])
})

test('flagAsBool passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = flagAsBool({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})