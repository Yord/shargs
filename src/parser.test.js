const {parser, parserSync} = require('.')

test('parser works with async stages 1', async () => {
  const stages = {
    toArgv:                    any => Promise.resolve(({errs: [], argv: any })),
    argv:           [a             => Promise.resolve(a                      )],
    toOpts:   () => ({errs, argv}) => Promise.resolve(({errs,     opts: argv})),
    opts:           [a             => Promise.resolve(a                      )],
    toArgs:         ({errs, opts}) => Promise.resolve(({errs,     args: opts})),
    args:           [a             => Promise.resolve(a                      )],
    fromArgs:       a              => Promise.resolve(a                       )
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: argv
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with async stages 2', async () => {
  const stages = {
    argv: [a => Promise.resolve(a)],
    opts: [a => Promise.resolve(a)],
    args: [a => Promise.resolve(a)]
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with undefined stages', () => {
  const stages = undefined

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with undefined stages', async () => {
  const stages = undefined

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with undefined substages', () => {
  const stages = {}

  const substages = undefined

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with undefined substages', async () => {
  const stages = {}

  const substages = undefined

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with empty opts', () => {
  const stages = {}

  const substages = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = ['-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['-a', '1']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with empty opts', async () => {
  const stages = {}

  const substages = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['-a', '1']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with undefined argv', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = undefined

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: []
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with undefined argv', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = undefined

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: []
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with undefined stages', () => {
  const stages = {
    toArgv:   undefined,
    argv:     undefined,
    toOpts:   undefined,
    opts:     undefined,
    toArgs:   undefined,
    args:     undefined,
    fromArgs: undefined
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with undefined stages', async () => {
  const stages = {
    toArgv:   undefined,
    argv:     undefined,
    toOpts:   undefined,
    opts:     undefined,
    toArgs:   undefined,
    args:     undefined,
    fromArgs: undefined
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with sample stages', () => {
  const stages = {
    toArgv:                    any => ({errs: [], argv: any }),
    argv:           [a             => a                      ],
    toOpts:   () => ({errs, argv}) => ({errs,     opts: argv}),
    opts:           [a             => a                      ],
    toArgs:         ({errs, opts}) => ({errs,     args: opts}),
    args:           [a             => a                      ],
    fromArgs:       a              => a
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: ['-a', '1']
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with sample stages', async () => {
  const stages = {
    toArgv:                    any => ({errs: [], argv: any }),
    argv:           [a             => a                      ],
    toOpts:   () => ({errs, argv}) => ({errs,     opts: argv}),
    opts:           [a             => a                      ],
    toArgs:         ({errs, opts}) => ({errs,     args: opts}),
    args:           [a             => a                      ],
    fromArgs:       a              => a
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: ['-a', '1']
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with empty stages', () => {
  const stages = {
    toArgv:         ({errs, any }) => ({}),
    argv:          [({errs, argv}) => ({})],
    toOpts:   () => ({errs, argv}) => ({}),
    opts:          [({errs, opts}) => ({})],
    toArgs:         ({errs, opts}) => ({}),
    args:          [({errs, args}) => ({})],
    fromArgs:       ({errs, args}) => ({})
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  // @ts-ignore
  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {}

  expect(res).toStrictEqual(exp)
})

test('parser works with empty stages', async () => {
  const stages = {
    toArgv:         ({errs, any }) => ({}),
    argv:          [({errs, argv}) => ({})],
    toOpts:   () => ({errs, argv}) => ({}),
    opts:          [({errs, opts}) => ({})],
    toArgs:         ({errs, opts}) => ({}),
    args:          [({errs, args}) => ({})],
    fromArgs:       ({errs, args}) => ({})
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  // @ts-ignore
  const res = await parser(stages, substages)(opt)(argv)

  const exp = {}

  expect(res).toStrictEqual(exp)
})

test('parserSync works with stages returning undefined', () => {
  const stages = {
    toArgv:         () => undefined,
    argv:          [() => undefined],
    toOpts:   () => () => undefined,
    opts:          [() => undefined],
    toArgs:         () => undefined,
    args:          [() => undefined],
    fromArgs:       () => undefined
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = undefined

  expect(res).toStrictEqual(exp)
})

test('parser works with stages returning undefined', async () => {
  const stages = {
    toArgv:         () => undefined,
    argv:          [() => undefined],
    toOpts:   () => () => undefined,
    opts:          [() => undefined],
    toArgs:         () => undefined,
    args:          [() => undefined],
    fromArgs:       () => undefined
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = undefined

  expect(res).toStrictEqual(exp)
})

test('parserSync works with flag options', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 1}
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with flag options', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 1}
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate flag options by combining them', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '-a']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 2}
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate flag options by combining them', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '-a']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 2}
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with primitive options', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with primitive options', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate primitive options by taking the first option', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '-a', '2']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate primitive options by taking the first option', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '-a', '2']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with incomplete primitive options', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['-a']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with incomplete primitive options', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['-a']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with primitive positional arguments', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with primitive positional arguments', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate positional arguments by adding remaining ones to the rest array', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['2'],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate positional arguments by adding remaining ones to the rest array', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['2'],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with array options', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with array options', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate array options by taking the first one', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2', '-a', '3', '4']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate array options by taking the first one', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2', '-a', '3', '4']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with incomplete array options', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['-a', '1']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with incomplete array options', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['-a', '1']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with array positional arguments', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with array positional arguments', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate array positional arguments by adding all remaining to the rest array', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2', '3', '4']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['3', '4'],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate array positional arguments by adding all remaining to the rest array', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A', 'B']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2', '3', '4']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['3', '4'],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with variadic options', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2', '3']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with variadic options', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2', '3']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with empty variadic options', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: []
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with empty variadic options', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: []
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync does not work with duplicate variadic options without --', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2', '-a', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2', '-a', '3']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser does not work with duplicate variadic options without --', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2', '-a', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2', '-a', '3']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate variadic options with -- by taking only the first one', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2', '--', '-a', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate variadic options with -- by taking only the first one', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '2', '--', '-a', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with variadic positional arguments', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc'}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2', '3']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with variadic positional arguments', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc'}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2', '3']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with variadic positional arguments and --', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc'}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2', '--', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['3'],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with variadic positional arguments and --', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc'}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2', '--', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['3'],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate variadic positional arguments and -- by taking only the first', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc'}

  const opt = {
    key: 'Foo',
    opts: [
      arc,
      arc
    ]
  }

  const argv = ['1', '2', '--', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate variadic positional arguments and -- by taking only the first', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc'}

  const opt = {
    key: 'Foo',
    opts: [
      arc,
      arc
    ]
  }

  const argv = ['1', '2', '--', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: ['1', '2']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with empty subcommands 1', () => {
  const stages = {}

  const substages = {}

  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: ['1']
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with empty subcommands 1', async () => {
  const stages = {}

  const substages = {}

  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: ['1']
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with empty subcommands 2', () => {
  const stages = {}

  const substages = {}

  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['1', 'Arc']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['1'],
      Arc: {
        _: []
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with empty subcommands 2', async () => {
  const stages = {}

  const substages = {}

  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['1', 'Arc']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['1'],
      Arc: {
        _: []
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with empty subcommands 3', () => {
  const stages = {}

  const substages = {}

  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', '--', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['1'],
      Arc: {
        _: []
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with empty subcommands 3', async () => {
  const stages = {}

  const substages = {}

  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', '--', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['1'],
      Arc: {
        _: []
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with unused subcommands', () => {
  const stages = {}

  const substages = {}

  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['1']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with unused subcommands', async () => {
  const stages = {}

  const substages = {}

  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: ['1']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with subcommands', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', '-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        arc: '1'
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with subcommands', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', '-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        arc: '1'
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with subcommands and positional arguments', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        arc: '1'
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with subcommands and positional arguments', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        arc: '1'
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with subcommands of subcommands and positional arguments', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}
  const Bat = {key: 'Bat', args: ['Bat'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    Bat
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', 'Bat', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        Bat: {
          _: [],
          arc: '1'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with subcommands of subcommands and positional arguments', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}
  const Bat = {key: 'Bat', args: ['Bat'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    Bat
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', 'Bat', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        Bat: {
          _: [],
          arc: '1'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with subcommands of subcommands of subcommands and positional arguments', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}
  const Cat = {key: 'Cat', args: ['Cat'], opts: [
    arc
  ]}
  const Bat = {key: 'Bat', args: ['Bat'], opts: [
    Cat
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    Bat
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', 'Bat', 'Cat', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        Bat: {
          _: [],
          Cat: {
            _: [],
            arc: '1'
          }
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with subcommands of subcommands of subcommands and positional arguments', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', types: ['A']}
  const Cat = {key: 'Cat', args: ['Cat'], opts: [
    arc
  ]}
  const Bat = {key: 'Bat', args: ['Bat'], opts: [
    Cat
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    Bat
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', 'Bat', 'Cat', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        Bat: {
          _: [],
          Cat: {
            _: [],
            arc: '1'
          }
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with subcommands of subcommands', () => {
  const stages = {
    opts: [
      ({errs, opts}) => ({
        errs,
        opts: opts.map(opt =>
          ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
        )
      })
    ]
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    Bar
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', 'Bar', '-a', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        Bar: {
          _: [],
          arc: 'foo'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with subcommands of subcommands', async () => {
  const stages = {
    opts: [
      ({errs, opts}) => ({
        errs,
        opts: opts.map(opt =>
          ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
        )
      })
    ]
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    Bar
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc
    ]
  }

  const argv = ['Arc', 'Bar', '-a', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      Arc: {
        _: [],
        Bar: {
          _: [],
          arc: 'foo'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with substages', () => {
  const stages = {}

  const substages = {
    Arc: {
      Bar: [
        ({errs, opts}) => ({
          errs,
          opts: opts.map(opt =>
            ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
          )
        })
      ]
    }
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    Bar,
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Bar', '-a', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: '2',
        Bar: {
          _: [],
          arc: 'foo'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with substages', async () => {
  const stages = {}

  const substages = {
    Arc: {
      Bar: [
        ({errs, opts}) => ({
          errs,
          opts: opts.map(opt =>
            ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
          )
        })
      ]
    }
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    Bar,
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Bar', '-a', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: '2',
        Bar: {
          _: [],
          arc: 'foo'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with default substages 1', () => {
  const stages = {}

  const substages = {
    _: [
      ({errs, opts}) => ({
        errs,
        opts: opts.map(opt =>
          ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
        )
      })
    ]
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      Bar,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Bar', '-a', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: 'foo'
      },
      Bar: {
        _: [],
        arc: 'foo'
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with default substages 1', async () => {
  const stages = {}

  const substages = {
    _: [
      ({errs, opts}) => ({
        errs,
        opts: opts.map(opt =>
          ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
        )
      })
    ]
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      Bar,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Bar', '-a', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: 'foo'
      },
      Bar: {
        _: [],
        arc: 'foo'
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with default substages 2', () => {
  const stages = {}

  const substages = {
    _: [
      ({errs, opts}) => ({
        errs,
        opts: opts.map(opt =>
          ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
        )
      })
    ]
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc,
    Bar
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Bar', '-a', '3']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: 'foo',
        Bar: {
          _: [],
          arc: '3'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with default substages 2', async () => {
  const stages = {}

  const substages = {
    _: [
      ({errs, opts}) => ({
        errs,
        opts: opts.map(opt =>
          ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
        )
      })
    ]
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc,
    Bar
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Bar', '-a', '3']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: 'foo',
        Bar: {
          _: [],
          arc: '3'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with default substages 3', () => {
  const stages = {}

  const substages = {
    _: {
      Cat: [
        ({errs, opts}) => ({
          errs,
          opts: opts.map(opt =>
            ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
          )
        })
      ]
    }
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Cat = {key: 'Cat', args: ['Cat'], opts: [
    arc
  ]}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc,
    Cat
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc,
    Cat
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      Bar,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Cat', '-a', '3', 'Bar', '-a', '4', 'Cat', '-a', '5']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: '2',
        Cat: {
          _: [],
          arc: 'foo'
        }
      },
      Bar: {
        _: [],
        arc: '4',
        Cat: {
          _: [],
          arc: 'foo'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with default substages 3', async () => {
  const stages = {}

  const substages = {
    _: {
      Cat: [
        ({errs, opts}) => ({
          errs,
          opts: opts.map(opt =>
            ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
          )
        })
      ]
    }
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Cat = {key: 'Cat', args: ['Cat'], opts: [
    arc
  ]}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc,
    Cat
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc,
    Cat
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      Bar,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Cat', '-a', '3', 'Bar', '-a', '4', 'Cat', '-a', '5']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: '2',
        Cat: {
          _: [],
          arc: 'foo'
        }
      },
      Bar: {
        _: [],
        arc: '4',
        Cat: {
          _: [],
          arc: 'foo'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with default substages 4', () => {
  const stages = {}

  const substages = {
    _: {
      _: [
        ({errs, opts}) => ({
          errs,
          opts: opts.map(opt =>
            ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
          )
        })
      ]
    }
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Cat = {key: 'Cat', args: ['Cat'], opts: [
    arc
  ]}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc,
    Bar,
    Cat
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Bar', '-a', '3', 'Cat', '-a', '4']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: '2',
        Bar: {
          _: [],
          arc: 'foo'
        },
        Cat: {
          _: [],
          arc: 'foo'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with default substages 4', async () => {
  const stages = {}

  const substages = {
    _: {
      _: [
        ({errs, opts}) => ({
          errs,
          opts: opts.map(opt =>
            ({...opt, ...(opt.key === 'arc' ? {values: ['foo']} : {})})
          )
        })
      ]
    }
  }

  const arc = {key: 'arc', args: ['-a'], types: ['A']}
  const Cat = {key: 'Cat', args: ['Cat'], opts: [
    arc
  ]}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [
    arc
  ]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc,
    Bar,
    Cat
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '1', 'Arc', '-a', '2', 'Bar', '-a', '3', 'Cat', '-a', '4']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1',
      Arc: {
        _: [],
        arc: '2',
        Bar: {
          _: [],
          arc: 'foo'
        },
        Cat: {
          _: [],
          arc: 'foo'
        }
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate subcommands by only taking the first', () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '-a', 'Arc', '-a', 'Arc', '-a']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 2},
      Arc: {
        _: [],
        arc: {type: 'flag', count: 1}
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate subcommands by only taking the first', async () => {
  const stages = {}

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '-a', 'Arc', '-a', 'Arc', '-a']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 2},
      Arc: {
        _: [],
        arc: {type: 'flag', count: 1}
      }
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate subcommands by setting fromArgs to the identity function', () => {
  const identity = a => a

  const stages = {
    fromArgs: identity
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '-a', 'Arc', '-a', 'Arc', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: {type: 'flag', count: 2}
      },
      {
        Arc: {
          _: [],
          arc: {type: 'flag', count: 1}
        }
      },
      {
        Arc: {
          _: ['1']
        }
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate subcommands by setting fromArgs to the identity function', async () => {
  const identity = a => a

  const stages = {
    fromArgs: identity
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '-a', 'Arc', '-a', 'Arc', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: {type: 'flag', count: 2}
      },
      {
        Arc: {
          _: [],
          arc: {type: 'flag', count: 1}
        }
      },
      {
        Arc: {
          _: ['1']
        }
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync works with duplicate subcommands by using a custom fromArgs function', () => {
  const merge = (obj1, obj2) => ({
    ...obj1,
    subcommands: [
      ...(obj1.subcommands || []),
      obj2
    ]
  })
  
  const fromArgs = ({errs, args}) => ({
    errs,
    args: args.slice(1).reduce(merge, args[0])
  })

  const stages = {
    fromArgs
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '-a', 'Arc', '-a', 'Arc', '1']

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 2},
      subcommands: [
        {
          Arc: {
            _: [],
            arc: {type: 'flag', count: 1}
          }
        },
        {
          Arc: {
            _: ['1']
          }
        }
      ]
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate subcommands by using a custom fromArgs function', async () => {
  const merge = (obj1, obj2) => ({
    ...obj1,
    subcommands: [
      ...(obj1.subcommands || []),
      obj2
    ]
  })
  
  const fromArgs = ({errs, args}) => ({
    errs,
    args: args.slice(1).reduce(merge, args[0])
  })

  const stages = {
    fromArgs
  }

  const substages = {}

  const arc = {key: 'arc', args: ['-a'], types: []}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc
  ]}

  const opt = {
    key: 'Foo',
    opts: [
      Arc,
      arc
    ]
  }

  const argv = ['-a', '-a', 'Arc', '-a', 'Arc', '1']

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 2},
      subcommands: [
        {
          Arc: {
            _: [],
            arc: {type: 'flag', count: 1}
          }
        },
        {
          Arc: {
            _: ['1']
          }
        }
      ]
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync passes on errors from argv stages', () => {
  const err = {code: 'Test', msg: 'This is a test.', info: {}}

  const withErr = ({errs, argv}) => ({errs: [...errs, err], argv})

  const stages = {
    argv: [withErr]
  }

  const substages = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = []

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [
      err
    ],
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})

test('parser passes on errors from argv stages', async () => {
  const err = {code: 'Test', msg: 'This is a test.', info: {}}

  const withErr = ({errs, argv}) => ({errs: [...errs, err], argv})

  const stages = {
    argv: [withErr]
  }

  const substages = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = []

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [
      err
    ],
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync passes on errors from opts stages', () => {
  const err = {code: 'Test', msg: 'This is a test.', info: {}}

  const withErr = ({errs, opts}) => ({errs: [...errs, err], opts})

  const stages = {
    opts: [withErr]
  }

  const substages = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = []

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [
      err
    ],
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})

test('parser passes on errors from opts stages', async () => {
  const err = {code: 'Test', msg: 'This is a test.', info: {}}

  const withErr = ({errs, opts}) => ({errs: [...errs, err], opts})

  const stages = {
    opts: [withErr]
  }

  const substages = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = []

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [
      err
    ],
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})

test('parserSync passes on errors from args stages', () => {
  const err = {code: 'Test', msg: 'This is a test.', info: {}}

  const withErr = ({errs, args}) => ({errs: [...errs, err], args})

  const stages = {
    args: [withErr]
  }

  const substages = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = []

  const res = parserSync(stages, substages)(opt)(argv)

  const exp = {
    errs: [
      err
    ],
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})

test('parser passes on errors from args stages', async () => {
  const err = {code: 'Test', msg: 'This is a test.', info: {}}

  const withErr = ({errs, args}) => ({errs: [...errs, err], args})

  const stages = {
    args: [withErr]
  }

  const substages = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = []

  const res = await parser(stages, substages)(opt)(argv)

  const exp = {
    errs: [
      err
    ],
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})