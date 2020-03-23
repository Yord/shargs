const flagAsNumber = require('./flagAsNumber')

test('flagAsNumber README example works', () => {
  const obj = {
    args: {
      version: {type: 'flag', count: 2}
    }
  }

  const {args} = flagAsNumber(obj)

  const exp = {
    version: 2
  }

  expect(args).toStrictEqual(exp)
})

test('flagAsNumber works as expected on all types', () => {
  const obj = {
    args: {
      title: "The Hitchhiker's Guide to the Galaxy",
      numBool: [23, true],
      answer: 42,
      help: 'foo --bar',
      verbose: false,
      version: {type: 'flag', count: 1},
      no: undefined,
      nono: null
    }
  }

  const {args} = flagAsNumber(obj)

  const exp = {
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    answer: 42,
    help: 'foo --bar',
    verbose: false,
    version: 1,
    no: undefined,
    nono: null
  }

  expect(args).toStrictEqual(exp)
})

test('flagAsNumber is recursive', () => {
  const obj = {
    args: {
      title: "The Hitchhiker's Guide to the Galaxy",
      numBool: [23, true],
      command: {
        answer: 42,
        help: 'foo --bar',
        verbose: false,
        version: {type: 'flag', count: 1}
      }
    }
  }

  const {args} = flagAsNumber(obj)

  const exp = {
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    command: {
      answer: 42,
      help: 'foo --bar',
      verbose: false,
      version: 1
    }
  }

  expect(args).toStrictEqual(exp)
})

test('flagAsNumber works if opts is undefined', () => {
  const obj = {}

  const {args} = flagAsNumber(obj)

  expect(args).toStrictEqual({})
})

test('flagAsNumber works if input is undefined', () => {
  const {args} = flagAsNumber()

  expect(args).toStrictEqual({})
})