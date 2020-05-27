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