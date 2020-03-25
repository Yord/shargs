const bestGuessRest = require('./bestGuessRest')

test('bestGuessRest README example works', () => {
  const obj = {
    args: {
      _: ['--name', 'Logan', 'foo', '-v'],
      foo: 42,
      command: {
        _: ['bar', '-h', '--age', 'unknown', '-h']
      }
    }
  }

  const {args} = bestGuessRest(obj)

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

test('bestGuessRest does not override existing keys', () => {
  const obj = {
    args: {
      _: ['--name', 'Logan'],
      name: 'Charles'
    }
  }

  const {args} = bestGuessRest(obj)

  const exp = obj.args

  expect(args).toStrictEqual(exp)
})

test('bestGuessRest does not interpret short options that are too long', () => {
  const obj = {
    args: {
      _: ['-name', 'Logan']
    }
  }

  const {args} = bestGuessRest(obj)

  const exp = obj.args

  expect(args).toStrictEqual(exp)
})