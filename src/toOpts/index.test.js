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

test('toOpts works for nonempty command and empty argv', () => {
  const arc = {key: 'arc'}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = []

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      arc
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for empty command and nonempty argv', () => {
  const opt = {
    key: 'opt',
    opts: []
  }

  const errs = []

  const argv = ['unknown']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {values: ['unknown']}
    ]
  }

  expect(res).toStrictEqual(exp)
})