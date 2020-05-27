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

test('toOpts works for array options', () => {
  const arc = {key: 'arc', args: ['-a'], types: ['A', 'B']}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = ['-a', '1', '2']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...arc, values: ['1', '2']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for variadic options', () => {
  const arc = {key: 'arc', args: ['-a']}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = ['-a', '1', '2', '3']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...arc, types: ['string', 'string', 'string'], values: ['1', '2', '3']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for primitive positional arguments', () => {
  const arc = {key: 'arc', types: ['A']}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = ['1']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...arc, values: ['1']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for array positional arguments', () => {
  const arc = {key: 'arc', types: ['A', 'B']}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = ['1', '2']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...arc, values: ['1', '2']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for variadic positional arguments', () => {
  const arc = {key: 'arc'}

  const opt = {
    key: 'opt',
    opts: [
      arc
    ]
  }

  const errs = []

  const argv = ['1', '2', '3']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...arc, types: ['string', 'string', 'string'], values: ['1', '2', '3']}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for subcommands', () => {
  const Arc = {key: 'Arc', args: ['Arc'], opts: []}

  const opt = {
    key: 'opt',
    opts: [
      Arc
    ]
  }

  const errs = []

  const argv = ['Arc']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...Arc, values: []}
    ]
  }

  expect(res).toStrictEqual(exp)
})

test('toOpts works for subcommands with flag options', () => {
  const arc = {key: 'arc', args: ['-a'], types: []}
  const bar = {key: 'bar'}
  const cat = {key: 'cat'}
  const Arc = {key: 'Arc', args: ['Arc'], opts: [
    arc,
    bar
  ]}

  const opt = {
    key: 'opt',
    opts: [
      Arc,
      cat
    ]
  }

  const errs = []

  const argv = ['Arc', '-a']

  const res = toOpts(opt)({errs, argv})

  const exp = {
    errs: [],
    opts: [
      {...Arc, values: [
        {...arc, values: [1]},
        bar
      ]},
      cat
    ]
  }

  expect(res).toStrictEqual(exp)
})