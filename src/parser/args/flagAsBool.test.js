const flagAsBool = require('./flagAsBool')

test('flagAsBool README example works', () => {
  const obj = {
    args: {
      version: {type: 'flag', count: 1}
    }
  }

  const {args} = flagAsBool(obj)

  const exp = {
    version: true
  }

  expect(args).toStrictEqual(exp)
})

test('flagAsBool works as expected on all types', () => {
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

  const {args} = flagAsBool(obj)

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

test('flagAsBool is recursive', () => {
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

  const {args} = flagAsBool(obj)

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

test('flagAsBool removes functions', () => {
  const obj = {
    args: {
      f: () => {}
    }
  }

  const {args} = flagAsBool(obj)

  const exp = {}

  expect(args).toStrictEqual(exp)
})

test('flagAsBool works if opts is undefined', () => {
  const obj = {}

  const {args} = flagAsBool(obj)

  expect(args).toStrictEqual({})
})

test('flagAsBool works if input is undefined', () => {
  const {args} = flagAsBool()

  expect(args).toStrictEqual({})
})