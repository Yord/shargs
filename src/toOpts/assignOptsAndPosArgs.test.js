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

test('assignOptsAndPosArgs works for incomplete primitive options', () => {
  const foo = {key: 'foo', types: ['foo'], args: ['-f']}

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
      {values: ['-f']}
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

test('assignOptsAndPosArgs works for incomplete array options', () => {
  const foo = {key: 'foo', types: ['foo', 'bar'], args: ['-f']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['-f', 'baz']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {values: ['-f']},
      {values: ['baz']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for variadic options 1/4', () => {
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

test('assignOptsAndPosArgs works for variadic options 2/4', () => {
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

test('assignOptsAndPosArgs works for variadic options 3/4', () => {
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

test('assignOptsAndPosArgs works for variadic options 4/4', () => {
  const foo = {key: 'foo', args: ['-f']}

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
      {...foo, types: [], values: []}
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

test('assignOptsAndPosArgs works for subcommand options 1', () => {
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

test('assignOptsAndPosArgs works for subcommand options 2', () => {
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

test('assignOptsAndPosArgs works for subcommand options 3', () => {
  const foo = {key: 'foo', args: ['foo'], opts: []}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = []

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: []
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for subcommand options with rest values', () => {
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

test('assignOptsAndPosArgs works for subcommand options 3', () => {
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

test('assignOptsAndPosArgs works for subcommand options 4', () => {
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

test('assignOptsAndPosArgs works for subcommand options 5', () => {
  const art = {key: 'art', types: [], args: ['-a']}
  const but = {key: 'but', types: [], args: ['-b']}
  const bar = {key: 'bar', args: ['bar'], opts: [
    art,
    but
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

  const argv = ['foo', 'bar', '-a', '-b', 'bar', '-a']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...bar, values: [
          {...art, values: [1]},
          {...but, values: [1]}
        ]},
        {...bar, values: [
          {...art, values: [1]}
        ]}
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for subcommand options 6', () => {
  const bar = {key: 'bar', args: ['bar'], opts: []}
  const bat = {key: 'bat', args: ['bat'], opts: []}
  const baz = {key: 'baz', args: ['baz'], opts: [bat]}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar,
    baz
  ]}

  const opt = {
    key: 'yay',
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['foo', 'bar', 'baz', 'bat', 'bar']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...bar, values: []},
        {...baz, values: [
          {...bat, values: []}
        ]},
        {...bar, values: []}
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs takes the innermost subcommand if it has conflicting options', () => {
  const art = {key: 'art', types: [], args: ['-a']}
  const bar = {key: 'bar', args: ['bar'], opts: [
    art
  ]}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar,
    art
  ]}

  const opt = {
    opts: [
      foo,
      art
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

test('assignOptsAndPosArgs takes the outer subcommand if it has conflicting options, but was canceled', () => {
  const art = {key: 'art', types: [], args: ['-a']}
  const bar = {key: 'bar', args: ['bar'], opts: [
    art
  ]}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar,
    art
  ]}

  const opt = {
    opts: [
      foo,
      art
    ]
  }

  const errs = []

  const argv = ['foo', 'bar', '--', '-a']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...bar, values: [
          {values: ['--']}
        ]}
      ]},
      {...art, values: [1]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs takes the middle subcommand if it has conflicting options, in certain situations', () => {
  const art = {key: 'art', types: [], args: ['-a']}
  const bar = {key: 'bar', args: ['bar'], opts: [
    art
  ]}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar,
    art
  ]}

  const opt = {
    opts: [
      foo,
      art
    ]
  }

  const errs = []

  const argv = ['foo', 'bar', '--', 'foo', '-a']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...bar, values: [
          {values: ['--']}
        ]}
      ]},
      {...foo, values: [
        {...art, values: [1]}
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for primitive pos args', () => {
  const foo = {key: 'foo', types: ['foo']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['a']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['a']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for two primitive pos args', () => {
  const foo = {key: 'foo', types: ['foo']}
  const bar = {key: 'bar', types: ['bar']}

  const opt = {
    opts: [
      foo,
      bar
    ]
  }

  const errs = []

  const argv = ['a', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['a']},
      {...bar, values: ['b']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for one primitive pos args with two arguments', () => {
  const foo = {key: 'foo', types: ['foo']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['a', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['a']},
      {values: ['b']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for array pos args', () => {
  const foo = {key: 'foo', types: ['foo', 'bar']}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['a', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['a', 'b']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for an array pos arg with a primitive pos args', () => {
  const foo = {key: 'foo', types: ['foo', 'bar']}
  const bar = {key: 'bar', types: ['baz']}

  const opt = {
    opts: [
      foo,
      bar
    ]
  }

  const errs = []

  const argv = ['a', 'b', 'c']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['a', 'b']},
      {...bar, values: ['c']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for variadic pos args 1', () => {
  const foo = {key: 'foo'}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['a', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, types: ['string', 'string'], values: ['a', 'b']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for variadic pos args 2', () => {
  const foo = {key: 'foo'}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['a', 'b', '--', 'c']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, types: ['string', 'string'], values: ['a', 'b']},
      {values: ['--']},
      {values: ['c']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works with primitive pos args in subcommands', () => {
  const baz = {key: 'baz', types: ['baz']}
  const bar = {key: 'bar', types: ['bar']}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar,
    baz
  ]}

  const opt = {
    opts: [
      foo
    ]
  }

  const errs = []

  const argv = ['foo', 'a', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...bar, values: ['a']},
        {...baz, values: ['b']}
      ]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works with primitive pos args in subcommand and command', () => {
  const baz = {key: 'baz', types: ['baz']}
  const bar = {key: 'bar', types: ['bar']}
  const foo = {key: 'foo', args: ['foo'], opts: [
    bar
  ]}

  const opt = {
    opts: [
      foo,
      baz
    ]
  }

  const errs = []

  const argv = ['foo', 'a', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [
        {...bar, values: ['a']}
      ]},
      {...baz, values: ['b']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works with primitive pos args in commands in subcommand scope', () => {
  const bar = {key: 'bar', types: ['bar']}
  const foo = {key: 'foo', args: ['foo'], opts: []}

  const opt = {
    opts: [
      foo,
      bar
    ]
  }

  const errs = []

  const argv = ['foo', 'a', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: []},
      {...bar, values: ['a']},
      {values: ['b']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for different options with the same args: if at least one subcommand is present, take only the first', () => {
  const foo = {key: 'foo', types: [], args: ['foo']}
  const bar = {key: 'bar', args: ['foo'], opts: []}
  const baz = {key: 'baz', args: ['foo'], opts: []}

  const opt = {
    opts: [
      foo,
      bar,
      baz
    ]
  }

  const errs = []

  const argv = ['foo', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...bar, values: [{values: ['b']}]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for different options with the same args: if no subcommand is present, take all options with the same length as the first', () => {
  const foo = {key: 'foo', types: [], args: ['foo']}
  const bar = {key: 'bar', types: ['bar'], args: ['foo']}
  const baz = {key: 'baz', types: [], args: ['foo']}

  const opt = {
    opts: [
      foo,
      bar,
      baz
    ]
  }

  const errs = []

  const argv = ['foo', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [1]},
      {...baz, values: [1]},
      {values: ['b']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for different options with the same args: if no subcommand is present, take all options with the same length as the first 1', () => {
  const foo = {key: 'foo', types: [], args: ['foo']}
  const bar = {key: 'bar', types: ['bar'], args: ['foo']}
  const baz = {key: 'baz', types: [], args: ['foo']}

  const opt = {
    opts: [
      foo,
      bar,
      baz
    ]
  }

  const errs = []

  const argv = ['foo', 'b']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: [1]},
      {...baz, values: [1]},
      {values: ['b']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for different options with the same args: if no subcommand is present, take all options with the same length as the first 2', () => {
  const foo = {key: 'foo', types: ['foo'], args: ['foo']}
  const bar = {key: 'bar', types: [], args: ['foo']}
  const baz = {key: 'baz', types: ['baz'], args: ['foo']}

  const opt = {
    opts: [
      foo,
      bar,
      baz
    ]
  }

  const errs = []

  const argv = ['foo', 'b', 'c']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['b']},
      {...baz, values: ['b']},
      {values: ['c']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for different options with the same args: if no subcommand is present, take all options with the same length as the first 3', () => {
  const foo = {key: 'foo', types: ['foo', 'foo'], args: ['foo']}
  const bar = {key: 'bar', types: [], args: ['foo']}
  const baz = {key: 'baz', types: ['baz', 'baz'], args: ['foo']}
  const bat = {key: 'bar', types: ['bat'], args: ['foo']}

  const opt = {
    opts: [
      foo,
      bar,
      baz,
      bat
    ]
  }

  const errs = []

  const argv = ['foo', 'b', 'c', 'd']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, values: ['b', 'c']},
      {...baz, values: ['b', 'c']},
      {values: ['d']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('assignOptsAndPosArgs works for different options with the same args: if no subcommand is present, take all options with the same length as the first 4', () => {
  const foo = {key: 'foo', args: ['foo']}
  const bar = {key: 'bar', types: [], args: ['foo']}
  const baz = {key: 'baz', args: ['foo']}
  const bat = {key: 'bar', types: ['bat'], args: ['foo']}
  const bam = {key: 'baz', types: ['bam', 'bam'], args: ['foo']}

  const opt = {
    opts: [
      foo,
      bar,
      baz,
      bat,
      bam
    ]
  }

  const errs = []

  const argv = ['foo', 'b', 'c', 'd']

  const res = assignOptsAndPosArgs(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...foo, types: ['string', 'string', 'string'], values: ['b', 'c', 'd']},
      {...baz, types: ['string', 'string', 'string'], values: ['b', 'c', 'd']}
    ]
  }

  expect(res).toStrictEqual(exp)
})