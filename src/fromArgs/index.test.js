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