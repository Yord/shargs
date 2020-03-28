const restrictToOnly = require('./restrictToOnly')
const {valueRestrictionsViolated} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('restrictToOnly README example works', () => {
  const answer = {...number('answer', ['-a', '--answer'], {only: [42]}), values: [23]}

  const obj = {
    opts: [answer]
  }

  const {errs} = restrictToOnly(obj)

  const exp = [
    valueRestrictionsViolated({
      key: answer.key,
      values: answer.values,
      index: 0,
      only: answer.only,
      option: answer
    })
  ]

  expect(errs).toStrictEqual(exp)
})

test('restrictToOnly works as expected on all types', () => {
  const obj = {
    opts: [
      {...string('title', ['--title'], {only: ["The Hitchhiker's Guide to the Galaxy"]}), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb'], {only: [23, true]}), values: [23, true]},
      {...number('answer', ['-a', '--answer'], {only: [42]}), values: [42]},
      {...command('help', ['-h', '--help'], {only: ['foo --bar']}), values: ['foo --bar']},
      {...bool('verbose', ['--verbose'], {only: [false]}), values: [false]},
      {...flag('version', ['--version'], {only: [1]}), values: [1]}
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
      {...flag('version', ['--version'], {only: null}), values: [1]},
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
      {...number('answer', ['-a', '--answer']), values: [42]},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: [false]},
      {...flag('version', ['--version']), values: [1]}
    ]
  }

  const {opts} = restrictToOnly(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('restrictToOnly works if values are undefined', () => {
  const answer = number('answer', ['-a', '--answer'], {only: [42]})

  const obj = {
    opts: [answer]
  }

  const {opts} = restrictToOnly(obj)

  const exp = [answer]

  expect(opts).toStrictEqual(exp)
})

test('restrictToOnly works if values are null', () => {
  const answer = {...number('answer', ['-a', '--answer'], {only: [42]}), values: null}
  
  const obj = {
    opts: [answer]
  }

  const {opts} = restrictToOnly(obj)

  const exp = [answer]

  expect(opts).toStrictEqual(exp)
})

test('restrictToOnly fails if a value is not allowed', () => {
  const obj = {
    opts: [
      {...string('title', ['--title'], {only: ["Dirk Gently"]}), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...number('answer', ['-a', '--answer'], {only: [23]}), values: [42]},
      {...command('help', ['-h', '--help'], {only: ['--foo bar']}), values: ['foo --bar']},
      {...bool('verbose', ['--verbose'], {only: [true]}), values: [false]}
    ]
  }

  const {errs} = restrictToOnly(obj)

  const exp = obj.opts.map(option => valueRestrictionsViolated({
    key: option.key,
    values: option.values,
    index: 0,
    only: option.only,
    option
  }))

  expect(errs).toStrictEqual(exp)
})

test('restrictToOnly fails on the first value of an array', () => {
  const only   = [42, true]
  const option = {...numberBool('numBool', ['-n', '--nb'], {only}), values: [23, true]}

  const obj = {opts: [option]}

  const {errs} = restrictToOnly(obj)

  const exp = [
    valueRestrictionsViolated({
      key: 'numBool',
      values: [23, true],
      index: 0,
      only,
      option
    })
  ]

  expect(errs).toStrictEqual(exp)
})

test('restrictToOnly fails on the second value of an array', () => {
  const only   = [23, false]
  const option = {...numberBool('numBool', ['-n', '--nb'], {only}), values: [23, true]}

  const obj = {opts: [option]}

  const {errs} = restrictToOnly(obj)

  const exp = [
    valueRestrictionsViolated({
      key: 'numBool',
      values: [23, true],
      index: 1,
      only,
      option
    })
  ]

  expect(errs).toStrictEqual(exp)
})

test('restrictToOnly works if opts is undefined', () => {
  const obj = {}

  const {opts} = restrictToOnly(obj)

  expect(opts).toStrictEqual([])
})

test('restrictToOnly works if input is undefined', () => {
  const {opts} = restrictToOnly()

  expect(opts).toStrictEqual([])
})

test('restrictToOnly passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = restrictToOnly({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})