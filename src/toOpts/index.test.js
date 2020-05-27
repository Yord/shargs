const {toOpts} = require('..')
const {CommandExpected} = require('../errors')

test('toOpts works for empty command and empty argv', () => {
  const opt = {
    key: 'opt',
    opts: []
  }

  const errs = []

  const argv = []

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: []
  }

  expect(res).toStrictEqual(exp)
})