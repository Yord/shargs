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

test('toOpts works for rest values', () => {
  const arc = {key: 'arc', args: ['-a'], types: []}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = ['unknown']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {values: ['unknown']},
      arc
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for flag options', () => {
  const arc = {key: 'arc', args: ['-a'], types: []}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = ['-a']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...arc, values: [1]}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for primitive options', () => {
  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = ['-a', '1']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...arc, values: ['1']}
    ]
  }

  expect(res).toStrictEqual(exp)
})