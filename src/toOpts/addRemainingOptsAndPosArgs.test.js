const {addRemainingOptsAndPosArgs} = require('./addRemainingOptsAndPosArgs')

test('addRemainingOptsAndPosArgs works for rest values', () => {
  const opt = {
    opts: []
  }

  const errs = []

  const opts = [
    {values: ['unknown']}
  ]

  const res = addRemainingOptsAndPosArgs(opt)({errs, opts})

  const exp = {
    errs: [],
    opts: [
      {values: ['unknown']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('addRemainingOptsAndPosArgs works for flag options', () => {
  const foo = {key: 'foo', types: [], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const opts = []

  const res = addRemainingOptsAndPosArgs(opt)({errs, opts})

  const exp = {
    errs: [],
    opts: [
      foo
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('addRemainingOptsAndPosArgs works for primitive options', () => {
  const foo = {key: 'foo', types: ['foo'], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const opts = []

  const res = addRemainingOptsAndPosArgs(opt)({errs, opts})

  const exp = {
    errs: [],
    opts: [
      foo
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('addRemainingOptsAndPosArgs works for array options', () => {
  const foo = {key: 'foo', types: ['foo', 'bar'], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const opts = []

  const res = addRemainingOptsAndPosArgs(opt)({errs, opts})

  const exp = {
    errs: [],
    opts: [
      foo
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('addRemainingOptsAndPosArgs works for variadic options', () => {
  const foo = {key: 'foo', args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const opts = []

  const res = addRemainingOptsAndPosArgs(opt)({errs, opts})

  const exp = {
    errs: [],
    opts: [
      foo
    ]
  }

  expect(res).toStrictEqual(exp)
})