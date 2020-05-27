const {fromArgs} = require('..')

test('fromArgs works for regular input', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const args1 = {_: []}

  const args = [
    args1
  ]

  const res = fromArgs({errs, args})

  const exp = {
    errs,
    args: args1
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs works for undefined input', () => {
  const res = fromArgs()

  const exp = {
    errs: [],
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs works for undefined errors', () => {
  const args1 = {_: []}

  const args = [
    args1
  ]

  const res = fromArgs({args})

  const exp = {
    errs: [],
    args: args1
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs works for undefined args', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const res = fromArgs({errs})

  const exp = {
    errs,
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs merges two rest arrays', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const args1 = {_: ['1']}
  const args2 = {_: ['2']}

  const args = [
    args1,
    args2
  ]

  const res = fromArgs({errs, args})

  const exp = {
    errs,
    args: {
      _: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs merges a primitive value', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const args1 = {_: ['1']}
  const args2 = {
    _: ['2'],
    arc: '3'
  }

  const args = [
    args1,
    args2
  ]

  const res = fromArgs({errs, args})

  const exp = {
    errs,
    args: {
      _: ['1', '2'],
      arc: '3'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs merges a primitive array', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const args1 = {_: ['1']}
  const args2 = {
    _: ['2'],
    arc: ['3', '4']
  }

  const args = [
    args1,
    args2
  ]

  const res = fromArgs({errs, args})

  const exp = {
    errs,
    args: {
      _: ['1', '2'],
      arc: ['3', '4']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs takes only the first duplicate primitive value', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const args1 = {_: ['1']}
  const args2 = {
    _: [],
    arc: '2'
  }
  const args3 = {
    _: ['3'],
    arc: '4'
  }

  const args = [
    args1,
    args2,
    args3
  ]

  const res = fromArgs({errs, args})

  const exp = {
    errs,
    args: {
      _: ['1', '3'],
      arc: '2'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs takes only the first duplicate primitive array', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const args1 = {_: ['1']}
  const args2 = {
    _: [],
    arc: ['2', '3']
  }
  const args3 = {
    _: ['4'],
    arc: ['5', '6']
  }

  const args = [
    args1,
    args2,
    args3
  ]

  const res = fromArgs({errs, args})

  const exp = {
    errs,
    args: {
      _: ['1', '4'],
      arc: ['2', '3']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs merges subcommands', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const args1 = {
    _: ['1'],
    arc: '2'
  }
  const args2 = {
    foo: {
      _: ['3'],
      bar: {type: 'flag', count: 2}
    }
  }

  const args = [
    args1,
    args2
  ]

  const res = fromArgs({errs, args})

  const exp = {
    errs,
    args: {
      _: ['1'],
      arc: '2',
      foo: {
        _: ['3'],
        bar: {type: 'flag', count: 2}
      }
    }
  }

  expect(res).toStrictEqual(exp)
})