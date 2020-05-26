const {assignOptsAndPosArgs} = require('./assignOptsAndPosArgs')

test('assignOptsAndPosArgs works for rest values', () => {
  const foo = {key: 'foo', types: [], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['unknown']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {values: ['unknown']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works with invalid values that are objects', () => {
  const foo = {}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['unknown']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {values: ['unknown']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works with -- and invalid values that are objects', () => {
  const foo = {key: 'foo', args: ['foo'], opts: []}
  const bar = {}

  const opt = {
    opts: [
      foo,
      bar
    ]
  }

  const errs = []

  const argv = ['foo', '--', 'foo']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {values: ['--']}
      ]},
      {...foo, values: []}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for flags', () => {
  const foo = {key: 'foo', types: [], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['-f']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [1]}
    ]
  }

  expect(res).toStrictEqual(exp)
})