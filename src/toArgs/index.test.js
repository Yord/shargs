const {toArgs} = require('..')

test('toArgs works for rest values', () => {
  const errs = []

  const opts = [
    {values: ['unknown']}
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: ['unknown']
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for cancel values', () => {
  const errs = []

  const opts = [
    {values: ['--']}
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for two rest values', () => {
  const errs = []

  const opts = [
    {values: ['unknown']},
    {values: ['accidental']}
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: ['unknown', 'accidental']
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs ignores options and positional arguments without values', () => {
  const arc = {key: 'arc', args: ['-a'], types: []}
  const bar = {key: 'bar', args: ['-b'], types: ['A']}
  const cat = {key: 'cat', args: ['-c'], types: ['B', 'C']}
  const dot = {key: 'dot', types: ['D']}
  const eat = {key: 'eat', types: ['E', 'F']}
  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const errs = []

  const opts = [
    arc,
    bar,
    cat,
    dot,
    eat,
    Arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs ignores invalid options', () => {
  const arc = null
  const bar = undefined
  const cat = 42
  const dot = 'yay'
  const eat = ['this', 'is', 'Sparta']
  const fit = {foo: 'bar'}

  const errs = []

  const opts = [
    arc,
    bar,
    cat,
    dot,
    eat,
    fit
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for flag options', () => {
  const arc = {key: 'arc', args: ['-a'], types: [], values: [1]}

  const errs = []

  const opts = [
    arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: {type: 'flag', count: 1}
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for duplicate flag options', () => {
  const arc = {key: 'arc', args: ['-a'], types: [], values: [1]}

  const errs = []

  const opts = [
    arc,
    arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: {type: 'flag', count: 2}
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for two flag options in different subcommands', () => {
  const arc = {key: 'arc', args: ['-a'], types: []}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [arc], values: [
    {...arc, values: [1]}
  ]}

  const errs = []

  const opts = [
    {...arc, values: [1]},
    Arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: {type: 'flag', count: 1}
      },
      {
        Arc: {
          _: [],
          arc: {type: 'flag', count: 1}
        }
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for primitive options', () => {
  const arc = {key: 'arc', args: ['-a'], types: ['A'], values: ['1']}

  const errs = []

  const opts = [
    arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: '1'
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for duplicate primitive options', () => {
  const arc1 = {key: 'arc', args: ['-a'], types: ['A'], values: ['1']}
  const arc2 = {key: 'arc', args: ['-a'], types: ['A'], values: ['2']}

  const errs = []

  const opts = [
    arc1,
    arc2
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: '1'
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for primitive positional arguments', () => {
  const arc = {key: 'arc', types: ['A'], values: ['1']}

  const errs = []

  const opts = [
    arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: '1'
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for two primitive positional arguments', () => {
  const arc1 = {key: 'arc', types: ['A'], values: ['1']}
  const arc2 = {key: 'arc', types: ['A'], values: ['2']}

  const errs = []

  const opts = [
    arc1,
    arc2
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: '1'
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for array options', () => {
  const arc = {key: 'arc', args: ['-a'], types: ['A', 'B'], values: ['1', '2']}

  const errs = []

  const opts = [
    arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: ['1', '2']
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for duplicate array options', () => {
  const arc1 = {key: 'arc', args: ['-a'], types: ['A', 'B'], values: ['1', '2']}
  const arc2 = {key: 'arc', args: ['-a'], types: ['A', 'B'], values: ['3', '4']}

  const errs = []

  const opts = [
    arc1,
    arc2
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: ['1', '2']
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for array positional arguments', () => {
  const arc = {key: 'arc', types: ['A', 'B'], values: ['1', '2']}

  const errs = []

  const opts = [
    arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: ['1', '2']
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for two array positional arguments', () => {
  const arc1 = {key: 'arc', types: ['A', 'B'], values: ['1', '2']}
  const arc2 = {key: 'arc', types: ['A', 'B'], values: ['3', '4', '5']}

  const errs = []

  const opts = [
    arc1,
    arc2
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: ['1', '2']
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for subcommands without values 1', () => {
  const Arc = {key: 'Arc', args: ['Arc'], opts: [], values: []}

  const errs = []

  const opts = [
    Arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      },
      {
        Arc: {_: []}
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for subcommands with values', () => {
  const arc = {key: 'arc', args: ['-a'], types: ['A'], values: ['1']}
  const bar = {key: 'bar', args: ['-b'], types: ['B']}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [bar], values: [
    {...bar, values: ['2']}
  ]}

  const errs = []

  const opts = [
    arc,
    Arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: '1'
      },
      {
        Arc: {
          _: [],
          bar: '2'
        }
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for nested subcommands', () => {
  const arc = {key: 'arc', args: ['-a'], types: ['A'], values: ['1']}
  const bar = {key: 'bar', args: ['-b'], types: ['B']}
  const cat = {key: 'cat', args: ['-c'], types: ['C']}
  const Bar = {key: 'Bar', args: ['Bar'], opts: [bar]}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [arc], values: [
    {...bar, values: ['2']},
    {...Bar, values: [
      {...cat, values: ['3']}
    ]}
  ]}

  const errs = []

  const opts = [
    Arc,
    arc
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: [],
        arc: '1'
      },
      {
        Arc: {
          _: [],
          bar: '2'
        }
      },
      {
        Arc: {
          Bar: {
            _: [],
            cat: '3'
          }
        }
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for duplicate subcommands without values', () => {
  const Arc1 = {key: 'Arc', args: ['Arc'], opts: [], values: []}
  const Arc2 = {key: 'Arc', args: ['Arc'], opts: [], values: []}

  const errs = []

  const opts = [
    Arc1,
    Arc2
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      },
      {
        Arc: {_: []}
      },
      {
        Arc: {_: []}
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works for duplicate subcommands with values', () => {
  const arc  = {key: 'arc', args: ['-a'], types: ['A']}
  const Arc1 = {key: 'Arc', args: ['Arc'], opts: [arc], values: [
    {...arc, values: ['1']}
  ]}
  const Arc2 = {key: 'Arc', args: ['Arc'], opts: [arc], values: [
    {...arc, values: ['2']}
  ]}

  const errs = []

  const opts = [
    Arc1,
    Arc2
  ]

  const res = toArgs({errs, opts})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      },
      {
        Arc: {
          _: [],
          arc: '1'
        }
      },
      {
        Arc: {
          _: [],
          arc: '2'
        }
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works with undefined input', () => {
  const res = toArgs()

  const exp = {
    errs: [],
    args: [
      {
        _: []
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works with empty input', () => {
  const res = toArgs({})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works without errs in input', () => {
  const opts = []

  const res = toArgs({opts})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs works without opts in input', () => {
  const errs = []

  const res = toArgs({errs})

  const exp = {
    errs: [],
    args: [
      {
        _: []
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toArgs passes on errors', () => {
  const err = {code: 'Test', msg: 'This is a test.', info: {}}

  const errs = [
    err
  ]

  const opts = []

  const res = toArgs({errs, opts})

  const exp = {
    errs: [
      err
    ],
    args: [
      {
        _: []
      }
    ]
  }

  expect(res).toStrictEqual(exp)
})