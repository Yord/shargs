const bestGuessArgs = require('./bestGuessArgs')

test('bestGuessArgs README example works', () => {
  const obj = {
    args: {
      _: ['--name', 'Logan', 'foo', '-v'],
      foo: 42,
      command: {
        _: ['bar', '-h', '--age', 'unknown', '-h']
      }
    }
  }

  const {args} = bestGuessArgs(obj)

  const exp = {
    _: ['foo'],
    name: 'Logan',
    v: {type: 'flag', count: 1},
    foo: 42,
    command: {
      _: ['bar'],
      h: {type: 'flag', count: 2},
      age: 'unknown'
    }
  }

  expect(args).toStrictEqual(exp)
})

test('bestGuessArgs does not override existing keys', () => {
  const obj = {
    args: {
      _: ['--name', 'Logan'],
      name: 'Charles'
    }
  }

  const {args} = bestGuessArgs(obj)

  const exp = obj.args

  expect(args).toStrictEqual(exp)
})

test('bestGuessArgs does not interpret short options that are too long', () => {
  const obj = {
    args: {
      _: ['-name', 'Logan']
    }
  }

  const {args} = bestGuessArgs(obj)

  const exp = obj.args

  expect(args).toStrictEqual(exp)
})

test('bestGuessArgs does not touch other arrays than _', () => {
  const obj = {
    args: {
      names: ['--name', 'Logan']
    }
  }

  const {args} = bestGuessArgs(obj)

  const exp = obj.args

  expect(args).toStrictEqual(exp)
})

test('bestGuessArgs does work despite getting nonsensical input', () => {
  const obj = {
    args: {
      _: ['--name', 42, '-f', [1], '-h', {foo: 42}]
    }
  }

  const {args} = bestGuessArgs(obj)

  const exp = {
    _: [42, [1], {foo: 42}],
    name: {type: 'flag', count: 1},
    f: {type: 'flag', count: 1},
    h: {type: 'flag', count: 1}
  }

  expect(args).toStrictEqual(exp)
})

test('bestGuessArgs even empties rest if args is undefined', () => {
  const obj = {}

  const {args} = bestGuessArgs(obj)

  expect(args._).toStrictEqual([])
})

test('bestGuessArgs even empties rest if input is undefined', () => {
  const {args} = bestGuessArgs()

  expect(args._).toStrictEqual([])
})

test('bestGuessArgs passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = bestGuessArgs({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})