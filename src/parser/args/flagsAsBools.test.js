const flagsAsBools = require('./flagsAsBools')

test('flagsAsBools README example works', () => {
  const obj = {
    args: {
      version: {type: 'flag', count: 1}
    }
  }

  const {args} = flagsAsBools(obj)

  const exp = {
    version: true
  }

  expect(args).toStrictEqual(exp)
})

test('flagsAsBools works as expected on all types', () => {
  const obj = {
    args: {
      title: "The Hitchhiker's Guide to the Galaxy",
      numBool: [23, true],
      answer: 42,
      help: 'foo --bar',
      verbose: false,
      version1: {type: 'flag', count: 1},
      version2: true,
      no: undefined,
      nono: null
    }
  }

  const {args} = flagsAsBools(obj)

  const exp = {
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    answer: 42,
    help: 'foo --bar',
    verbose: false,
    version1: true,
    version2: true,
    no: undefined,
    nono: null
  }

  expect(args).toStrictEqual(exp)
})

test('flagsAsBools is recursive', () => {
  const obj = {
    args: {
      title: "The Hitchhiker's Guide to the Galaxy",
      numBool: [23, true],
      command: {
        answer: 42,
        help: 'foo --bar',
        verbose: false,
        version1: {type: 'flag', count: 1},
        version2: true
      }
    }
  }

  const {args} = flagsAsBools(obj)

  const exp = {
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    command: {
      answer: 42,
      help: 'foo --bar',
      verbose: false,
      version1: true,
      version2: true
    }
  }

  expect(args).toStrictEqual(exp)
})

test('flagsAsBools works if opts is undefined', () => {
  const obj = {}

  const {args} = flagsAsBools(obj)

  expect(args).toStrictEqual({})
})

test('flagsAsBools works if input is undefined', () => {
  const {args} = flagsAsBools()

  expect(args).toStrictEqual({})
})

test('flagsAsBools passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = flagsAsBools({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})