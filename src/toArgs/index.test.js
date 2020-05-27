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