const {toArgv} = require('..')

test('toArgv works for regular input', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const any = []

  const res = toArgv({errs, any})

  const exp = {
    errs,
    argv: any
  }

  expect(res).toStrictEqual(exp)
})

test('toArgv works for undefined input', () => {
  const res = toArgv()

  const exp = {
    errs: [],
    argv: []
  }

  expect(res).toStrictEqual(exp)
})

test('toArgv works for undefined errors', () => {
  const any = []

  const res = toArgv({any})

  const exp = {
    errs: [],
    argv: any
  }

  expect(res).toStrictEqual(exp)
})

test('toArgv works for undefined argv', () => {
  const errs = [
    {code: 'Test', msg: 'This is a test.', info: {}}
  ]

  const res = toArgv({errs})

  const exp = {
    errs,
    argv: []
  }

  expect(res).toStrictEqual(exp)
})