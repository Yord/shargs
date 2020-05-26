const {parser} = require('.')

test('parser works with undefined stages', () => {
  const stages = undefined

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with undefined parsers', () => {
  const stages = {}

  const parsers = undefined

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with empty opts', () => {
  const stages = {}

  const parsers = {}

  const opt = {
    key: 'Foo',
    opts: []
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: ['-a', '1']
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with undefined argv', () => {
  const stages = {}

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = undefined

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: []
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with undefined errs', () => {
  const stages = {}

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = undefined

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with undefined stages', () => {
  const stages = {
    toArgv:   undefined,
    argv:     undefined,
    toOpts:   undefined,
    opts:     undefined,
    toArgs:   undefined,
    args:     undefined,
    fromArgs: undefined
  }

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with sample stages', () => {
  const stages = {
    toArgv:         ({errs, any }) => ({errs, argv: any }),
    argv:           [a             => a                  ],
    toOpts:   () => ({errs, argv}) => ({errs, opts: argv}),
    opts:           [a             => a                  ],
    toArgs:         ({errs, opts}) => ({errs, args: opts}),
    args:           [a             => a                  ],
    fromArgs:       a              => a
  }

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: ['-a', '1']
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with empty stages', () => {
  const stages = {
    toArgv:         ({errs, any }) => ({}),
    argv:          [({errs, argv}) => ({})],
    toOpts:   () => ({errs, argv}) => ({}),
    opts:          [({errs, opts}) => ({})],
    toArgs:         ({errs, opts}) => ({}),
    args:          [({errs, args}) => ({})],
    fromArgs:       ({errs, args}) => ({})
  }

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {}

  expect(res).toStrictEqual(exp)
})

test('parser works with stages returning undefined', () => {
  const stages = {
    toArgv:         () => undefined,
    argv:          [() => undefined],
    toOpts:   () => () => undefined,
    opts:          [() => undefined],
    toArgs:         () => undefined,
    args:          [() => undefined],
    fromArgs:       () => undefined
  }

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = undefined

  expect(res).toStrictEqual(exp)
})

test('parser works with flag options', () => {
  const stages = {}

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: []}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 1}
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate flag options by combining them', () => {
  const stages = {}

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: []}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '-a']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: {type: 'flag', count: 2}
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with primitive options', () => {
  const stages = {}

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate primitive options by taking the first option', () => {
  const stages = {}

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1', '-a', '2']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with primitive positional arguments', () => {
  const stages = {}

  const parsers = {}

  const arc = {key: 'arc', types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})

test('parser works with duplicate positional arguments by adding remaining ones to the rest array', () => {
  const stages = {}

  const parsers = {}

  const arc = {key: 'arc', types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['1', '2']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: ['2'],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})