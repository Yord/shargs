const transformArgs = require('./transformArgs')

const constant = c => (key, val, errs, args) => ({errs, args: {...args, [key]: c}})

test('transformArgs README example works', () => {
  const obj = {
    args: {
      title: "The Hitchhiker's Guide to the Galaxy",
      numBool: [23, true],
      answer: 42,
      command: {
        help: 'foo --bar',
        verbose: false,
        version: {type: 'flag', count: 1},
        no: undefined,
        nono: null,
        f: () => {},
        sym: Symbol('foo')
      }
    }
  }

  const fs = {
    undefined: constant('undefined'),
    null:      constant('null'),
    boolean:   constant('boolean'),
    number:    constant('number'),
    string:    constant('string'),
    array:     constant('array'),
    flag:      constant('flag'),
    function:  constant('function'),
    otherwise: constant('otherwise')
  }

  const {args} = transformArgs(fs)(obj)

  const exp = {
    title: 'string',
    numBool: 'array',
    answer: 'number',
    command: {
      help: 'string',
      verbose: 'boolean',
      version: 'flag',
      no: 'undefined',
      nono: 'null',
      f: 'function',
      sym: 'otherwise'
    }
  }

  expect(args).toStrictEqual(exp)
})

test('transformArgs README example works even if fs is undefined', () => {
  const obj = {
    args: {
      title: "The Hitchhiker's Guide to the Galaxy",
      numBool: [23, true],
      answer: 42,
      command: {
        help: 'foo --bar',
        verbose: false,
        version: {type: 'flag', count: 1},
        no: undefined,
        nono: null,
        f: () => {},
        sym: Symbol('foo')
      }
    }
  }

  const {args} = transformArgs()(obj)

  const exp = {
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    answer: 42,
    command: {
      help: 'foo --bar',
      verbose: false,
      version: {type: 'flag', count: 1},
      no: undefined,
      nono: null
    }
  }

  expect(args).toStrictEqual(exp)
})

test('transformArgs works if args are undefined', () => {
  const obj = {}

  const fs = {
    undefined: constant('undefined'),
    null:      constant('null'),
    boolean:   constant('boolean'),
    number:    constant('number'),
    string:    constant('string'),
    array:     constant('array'),
    flag:      constant('flag'),
    function:  constant('function'),
    otherwise: constant('otherwise')
  }

  const {args} = transformArgs(fs)(obj)

  expect(args).toStrictEqual({})
})