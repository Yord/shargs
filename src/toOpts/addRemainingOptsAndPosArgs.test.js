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

test('addRemainingOptsAndPosArgs works for primitive positional arguments', () => {
  const foo = {key: 'foo', types: ['foo']}

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

test('addRemainingOptsAndPosArgs works for array positional arguments', () => {
  const foo = {key: 'foo', types: ['foo', 'bar']}

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

test('addRemainingOptsAndPosArgs works for variadic positional arguments', () => {
  const foo = {key: 'foo'}

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

test('addRemainingOptsAndPosArgs works for command options 1', () => {
  const bar = {key: 'bar', types: [], args: ['-b']}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar
  ]}

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
      {...foo, values: [
        bar
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('addRemainingOptsAndPosArgs works for command options 2', () => {
  const bar = {key: 'bar', types: [], args: ['-b']}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar
  ]}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const opts = [
    {...foo, values: []}
  ]

  const res = addRemainingOptsAndPosArgs(opt)({errs, opts})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        bar
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})