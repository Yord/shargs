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