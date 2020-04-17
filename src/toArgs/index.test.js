const toArgs = require('./index')

const discard = () => () => ({
  args: {_: []}
})

test('toArgs transforms opts into args', () => {
  const obj = {
    opts: [
      {values: ['foo']},
      {key: 'title', types: ['string'], args: ['--title'], values: ["The Hitchhiker's Guide to the Galaxy"]},
      {key: 'numBool', types: ['number', 'bool'], args: ['-n', '--nb'], values: [23, true]},
      {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: [42]},
      {key: 'help', args: ['-h', '--help'], values: ['foo', '--bar'], opts: []},
      {key: 'verbose', types: ['bool'], args: ['--verbose'], values: [false]},
      {key: 'version', types: [], args: ['--version'], values: [1]},
      {values: ['bar']}
    ]
  }

  const {args} = toArgs({_: discard, __: discard})(obj)

  const exp = {
    _: ['foo', 'bar'],
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    answer: 42,
    help: {_: []},
    verbose: false,
    version: {type: 'flag', count: 1}
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs removes double minus', () => {
  const obj = {
    opts: [
      {values: ['--']}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: []
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs represents flags as counts', () => {
  const obj = {
    opts: [
      {key: 'verbose', types: [], args: ['-v'], values: [1]}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: [],
    verbose: {type: 'flag', count: 1}
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs counts the occurrences of flags', () => {
  const obj = {
    opts: [
      {key: 'verbose', types: [], args: ['-v'], values: [1]},
      {key: 'verbose', types: [], args: ['-v'], values: [1]},
      {key: 'verbose', types: [], args: ['-v'], values: [2]}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: [],
    verbose: {type: 'flag', count: 4}
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs counts the occurrences of flags and has a negative count if the flag was reversed', () => {
  const obj = {
    opts: [
      {key: 'verbose', types: [], args: ['-v'], values: [-1]},
      {key: 'verbose', types: [], args: ['-v'], values: [-1]},
      {key: 'verbose', types: [], args: ['-v'], values: [-1]}
    ]
  }

  const {args} = toArgs(discard)(obj)

  const exp = {
    _: [],
    verbose: {type: 'flag', count: -3}
  }

  expect(args).toStrictEqual(exp)
})

test('toArgs works if opts is undefined', () => {
  const obj = {}

  const {args} = toArgs(discard)(obj)

  expect(args).toStrictEqual({_: []})
})

test('toArgs works if input is undefined', () => {
  const {args} = toArgs(discard)()

  expect(args).toStrictEqual({_: []})
})

test('toArgs passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = toArgs(discard)({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})