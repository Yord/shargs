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

test('assignOptsAndPosArgs works for two flags with the same arg', () => {
  const foo = {key: 'foo', types: [], args: ['-f']}
  const bar = {key: 'bar', types: [], args: ['-f']}

  const opt = {
    opts: [
      foo,
      bar
    ]
  }

  const errs = []

  const argv = ['-f']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [1]},
      {...bar, values: [1]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for primitive options', () => {
  const foo = {key: 'foo', types: ['foo'], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['-f', 'bar']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['bar']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for two primitive options with the same arg', () => {
  const foo = {key: 'foo', types: ['foo'], args: ['-f']}
  const bar = {key: 'bar', types: ['bar'], args: ['-f']}

  const opt = {
    opts: [
      foo,
      bar
    ]
  }

  const errs = []

  const argv = ['-f', 'bar']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['bar']},
      {...bar, values: ['bar']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for array options', () => {
  const foo = {key: 'foo', types: ['foo', 'bar'], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['-f', 'baz', 'bat']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['baz', 'bat']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for two array options with the same arg', () => {
  const foo = {key: 'foo', types: ['foo', 'bar'], args: ['-f']}
  const bar = {key: 'bar', types: ['baz', 'bat'], args: ['-f']}

  const opt = {
    opts: [
      foo,
      bar
    ]
  }

  const errs = []

  const argv = ['-f', 'baz', 'bat']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['baz', 'bat']},
      {...bar, values: ['baz', 'bat']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for duplicate array options', () => {
  const foo = {key: 'foo', types: ['foo', 'bar'], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['-f', 'baz', 'bat', '-f', 'bam', 'cat']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['baz', 'bat']},
      {...foo, values: ['bam', 'cat']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for variadic options 1/3', () => {
  const foo = {key: 'foo', args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['-f', 'baz', 'bat']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, types: ['string', 'string'], values: ['baz', 'bat']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for variadic options 2/3', () => {
  const foo = {key: 'foo', args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['-f', 'baz', 'bat', '--']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, types: ['string', 'string'], values: ['baz', 'bat']},
      {values: ['--']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for variadic options 3/3', () => {
  const foo = {key: 'foo', args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['-f', 'baz', 'bat', '--', 'bam']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, types: ['string', 'string'], values: ['baz', 'bat']},
      {values: ['--']},
      {values: ['bam']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for two variadic options with the same arg', () => {
  const foo = {key: 'foo', args: ['-f']}
  const bar = {key: 'bar', args: ['-f']}

  const opt = {
    opts: [
      foo,
      bar
    ]
  }

  const errs = []

  const argv = ['-f', 'baz', 'bat']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, types: ['string', 'string'], values: ['baz', 'bat']},
      {...bar, types: ['string', 'string'], values: ['baz', 'bat']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for command options 1', () => {
  const foo = {key: 'foo', args: ['foo'], opts: []}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['foo']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: []}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for command options 2', () => {
  const art = {key: 'art', types: [], args: ['-a']}
  const foo = {key: 'foo', args: ['foo'], opts: [
    art
  ]}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['foo', '-a']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...art, values: [1]}
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for command options with rest values', () => {
  const Bar = {key: 'Bar', args: ['Bar'], opts: []}
  const Art = {key: 'Art', args: ['Art'], opts: [Bar]}

  const opt = {
    opts: [
      Art
    ]
  }

  const errs = []

  const argv = ['Art', 'Bar', '1']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...Art, values: [
        {...Bar, values: [
          {values: ['1']}
        ]}
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for command options 3', () => {
  const art = {key: 'art', types: [], args: ['-a']}
  const bar = {key: 'bar', args: ['bar'], opts: [
    art
  ]}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar
  ]}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['foo', 'bar', '-a']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...bar, values: [
          {...art, values: [1]}
        ]}
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for command options 4', () => {
  const art = {key: 'art', types: [], args: ['-a']}
  const but = {key: 'but', types: [], args: ['-b']}
  const bar = {key: 'bar', args: ['bar'], opts: [
    but,
    art
  ]}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar
  ]}

  const opt = {
    key: 'yay',
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['foo', 'bar', '-a', '-b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...bar, values: [
          {...art, values: [1]},
          {...but, values: [1]}
        ]}
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})