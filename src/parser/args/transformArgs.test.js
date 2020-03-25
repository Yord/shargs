const transformArgs = require('./transformArgs')

const constant = c => ({key, errs, args}) => ({errs, args: {...args, [key]: c}})

test('transformArgs README example works', () => {
  const obj = {
    args: {
      version: {type: 'flag', count: 2},
      answer: 23
    }
  }

  const fs = {
    flag:   ({key, val, errs, args}) => ({
      errs,
      args: {...args, [key]: val.count}
    }),
    number: ({key, val, errs, args}) => ({
      errs,
      args: {...args, [key]: val + 19}
    })
  }

  const {args} = transformArgs(fs)(obj)

  const exp = {
    version: 2,
    answer: 42
  }

  expect(args).toStrictEqual(exp)
})

test('transformArgs works as expected', () => {
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

test('transformArgs allows custom recursion with a custom object function', () => {
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
        sym: Symbol('foo')
      }
    }
  }

  const fs = {
    object: ({key, val, errs, args}) => {
      const {errs: errs2, args: args2} = transformArgs(fs)({args: val})
      const {[key]: _, ...rest} = args

      return {
        errs: errs.concat(errs2),
        args: {...rest, ...args2}
      }
    }
  }

  const exp = {
    title: "The Hitchhiker's Guide to the Galaxy",
    numBool: [23, true],
    answer: 42,
    help: 'foo --bar',
    verbose: false,
    version: {type: 'flag', count: 1},
    no: undefined,
    nono: null
  }

  const {args} = transformArgs(fs)(obj)

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

test('transformArgs works if input is undefined', () => {
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

  const {args} = transformArgs(fs)()

  expect(args).toStrictEqual({})
})

test('transformArgs passes on errors', () => {
  const ERRS = ['foo']

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
  
  const {errs} = transformArgs(fs)({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})