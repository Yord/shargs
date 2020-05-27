const {fromArgs} = require('..')

test('fromArgs works for regular input', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const args1 = {_: []}

  const args = [
    args1
  ]

  const res = fromArgs({errs, args})

  const exp = {
    errs,
    args: args1
  }

  expect(res).toStrictEqual(exp)
})

test('fromArgs works for undefined input', () => {
  const res = fromArgs()

  const exp = {
    errs: [],
    args: {_: []}
  }

  expect(res).toStrictEqual(exp)
})