const mergeArgs = require('./mergeArgs')

test('mergeArgs README example works', () => {
  const obj = {
    args: {
      _: ['--help'],
      version: {type: 'flag', count: 2},
      name: 'Logan',
      command: {
        _: ['-v'],
        version: {type: 'flag', count: 1},
        name: 'Charles',
        help: true
      },
      verbose: true
    }
  }

  const {args} = mergeArgs()(obj)

  const exp = {
    _: ['--help', '-v'],
    version: {type: 'flag', count: 2},
    name: 'Logan',
    help: true,
    verbose: true
  }

  expect(args).toStrictEqual(exp)
})

test('mergeArgs works if rest fields are missing', () => {
  const obj = {
    args: {
      version: {type: 'flag', count: 2},
      name: 'Logan',
      command: {
        version: {type: 'flag', count: 1},
        name: 'Charles',
        help: true
      },
      verbose: true
    }
  }

  const {args} = mergeArgs()(obj)

  const exp = {
    _: [],
    version: {type: 'flag', count: 2},
    name: 'Logan',
    help: true,
    verbose: true
  }

  expect(args).toStrictEqual(exp)
})

test('mergeArgs takes custom merge functions 1/2', () => {
  const obj = {
    args: {
      version: {type: 'flag', count: 2},
      name: 'Logan',
      command: {
        version: {type: 'flag', count: 1},
        name: 'Charles',
        help: true
      },
      verbose: true
    }
  }

  const mergeLeft  = (obj1, obj2) => ({...obj2, ...obj1})

  const {args} = mergeArgs(mergeLeft)(obj)

  const exp = {
    version: {type: 'flag', count: 2},
    name: 'Logan',
    help: true,
    verbose: true
  }

  expect(args).toStrictEqual(exp)
})

test('mergeArgs takes custom merge functions 2/2', () => {
  const obj = {
    args: {
      version: {type: 'flag', count: 2},
      name: 'Logan',
      command: {
        version: {type: 'flag', count: 1},
        name: 'Charles',
        help: true
      },
      verbose: true
    }
  }

  const mergeRight = (obj1, obj2) => ({...obj1, ...obj2})

  const {args} = mergeArgs(mergeRight)(obj)

  const exp = {
    version: {type: 'flag', count: 1},
    name: 'Charles',
    help: true,
    verbose: true
  }

  expect(args).toStrictEqual(exp)
})

test('mergeArgs works if opts is undefined', () => {
  const obj = {}

  const {args} = mergeArgs()(obj)

  expect(args).toStrictEqual({})
})

test('mergeArgs works if input is undefined', () => {
  const {args} = mergeArgs()()

  expect(args).toStrictEqual({})
})

test('mergeArgs passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = mergeArgs()({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})