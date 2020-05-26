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