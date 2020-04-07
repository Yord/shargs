const verifyValuesArity = require('./verifyValuesArity')
const {invalidArity, invalidTypes, invalidValues} = require('../errors')

test('verifyValuesArity README example works', () => {
  const name = {key: 'name', types: ['string'], args: ['--name'], values: ['Charles', 'Francis']}
  const opts = [name]

  const {errs} = verifyValuesArity({opts})

  const exp = [
    invalidArity({option: name})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity does not throw for correct arities in values', () => {
  const opts = [
    {key: 'rest', args: [], values: ['foo']},
    {values: ['foo']},

    {key: 'string1', types: ['string'], args: [], values: ['string']},
    {key: 'string2', types: ['string'], args: [], values: [42]},
    {key: 'string3', types: ['string'], args: [], values: null},
    {key: 'string4', types: ['string'], args: [], values: undefined},
    {key: 'string5', types: ['string'], args: []},
    
    {key: 'numBool1', types: ['number', 'bool'], args: [], values: ['23', 'true']},
    {key: 'numBool2', types: ['number', 'bool'], args: [], values: [42, 42]},
    {key: 'numBool3', types: ['number', 'bool'], args: [], values: null},
    {key: 'numBool4', types: ['number', 'bool'], args: [], values: undefined},
    {key: 'numBool5', types: ['number', 'bool'], args: []},

    {key: 'answer1', types: ['number'], args: [], values: ['42']},
    {key: 'answer2', types: ['number'], args: [], values: [true]},
    {key: 'number3', types: ['number'], args: [], values: null},
    {key: 'number4', types: ['number'], args: [], values: undefined},
    {key: 'number5', types: ['number'], args: []},
    
    {key: 'verbose1', types: ['bool'], args: [], values: ['false']},
    {key: 'verbose2', types: ['bool'], args: [], values: [42]},
    {key: 'bool3', types: ['bool'], args: [], values: null},
    {key: 'bool4', types: ['bool'], args: [], values: undefined},
    {key: 'bool5', types: ['bool'], args: []},
    
    {key: 'flag1', types: [], args: [], values: [1]},
    {key: 'flag2', types: [], args: [], values: ['42']},
    {key: 'flag3', types: [], args: [], values: null},
    {key: 'flag4', types: [], args: [], values: undefined},
    {key: 'flag5', types: [], args: []},

    {key: 'help1', types: null, args: [], values: []},
    {key: 'help2', types: null, args: [], values: ['foo']},
    {key: 'help3', types: null, args: [], values: ['foo', '--bar']},
    {key: 'help4', types: null, args: [], values: ['foo', 42, 'baz']}
  ]

  const {errs} = verifyValuesArity({opts})

  const exp = []

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity does not throw for correct arities in defaultValues', () => {
  const opts = [
    {key: 'rest', args: [], defaultValues: ['foo']},

    {key: 'string1', types: ['string'], args: [], defaultValues: ['string']},
    {key: 'string2', types: ['string'], args: [], defaultValues: [42]},
    {key: 'string3', types: ['string'], args: [], defaultValues: null},
    {key: 'string4', types: ['string'], args: [], defaultValues: undefined},
    
    {key: 'numBool1', types: ['number', 'bool'], args: [], defaultValues: ['23', 'true']},
    {key: 'numBool2', types: ['number', 'bool'], args: [], defaultValues: [42, 42]},
    {key: 'numBool3', types: ['number', 'bool'], args: [], defaultValues: null},
    {key: 'numBool4', types: ['number', 'bool'], args: [], defaultValues: undefined},

    {key: 'answer1', types: ['number'], args: [], defaultValues: ['42']},
    {key: 'answer2', types: ['number'], args: [], defaultValues: [true]},
    {key: 'number3', types: ['number'], args: [], defaultValues: null},
    {key: 'number4', types: ['number'], args: [], defaultValues: undefined},
    
    {key: 'verbose1', types: ['bool'], args: [], defaultValues: ['false']},
    {key: 'verbose2', types: ['bool'], args: [], defaultValues: [42]},
    {key: 'bool3', types: ['bool'], args: [], defaultValues: null},
    {key: 'bool4', types: ['bool'], args: [], defaultValues: undefined},
    
    {key: 'flag1', types: [], args: [], defaultValues: [1]},
    {key: 'flag2', types: [], args: [], defaultValues: ['42']},
    {key: 'flag3', types: [], args: [], defaultValues: null},
    {key: 'flag4', types: [], args: [], defaultValues: undefined},

    {key: 'help1', types: null, args: [], defaultValues: []},
    {key: 'help2', types: null, args: [], defaultValues: ['foo']},
    {key: 'help3', types: null, args: [], defaultValues: ['foo', '--bar']},
    {key: 'help4', types: null, args: [], defaultValues: ['foo', 42, 'baz']}
  ]

  const {errs} = verifyValuesArity({opts})

  const exp = []

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidArity error for incorrect arities for string, number, bool, and flag in values', () => {
  const string1 = {key: 'string1', types: ['string'], args: [], values: []}
  const string2 = {key: 'string2', types: ['string'], args: [], values: ['foo', 'bar']}
  const string3 = {key: 'string3', args: [], values: []}
  const string4 = {key: 'string4', args: [], values: ['foo', 'bar']}

  const number1 = {key: 'number1', types: ['number'], args: [], values: []}
  const number2 = {key: 'number2', types: ['number'], args: [], values: ['foo', 'bar']}
  const number3 = {key: 'number3', args: [], values: []}
  const number4 = {key: 'number4', args: [], values: ['foo', 'bar']}

  const bool1 = {key: 'bool1', types: ['bool'], args: [], values: []}
  const bool2 = {key: 'bool2', types: ['bool'], args: [], values: ['foo', 'bar']}
  const bool3 = {key: 'bool3', args: [], values: []}
  const bool4 = {key: 'bool4', args: [], values: ['foo', 'bar']}

  const flag1 = {key: 'flag1', types: [], args: [], values: []}
  const flag2 = {key: 'flag2', types: [], args: [], values: ['foo', 'bar']}
  const flag3 = {key: 'flag3', args: [], values: []}
  const flag4 = {key: 'flag4', args: [], values: ['foo', 'bar']}

  const opts = [
    string1, string2, string3, string4,
    number1, number2, number3, number4,
    bool1, bool2, bool3, bool4,
    flag1, flag2, flag3, flag4
  ]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidArity({option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidArity error for incorrect arities for string, number, bool, and flag in defaultValues', () => {
  const string1 = {key: 'string1', types: ['string'], args: [], defaultValues: []}
  const string2 = {key: 'string2', types: ['string'], args: [], defaultValues: ['foo', 'bar']}
  const string3 = {key: 'string3', args: [], defaultValues: []}
  const string4 = {key: 'string4', args: [], defaultValues: ['foo', 'bar']}

  const number1 = {key: 'number1', types: ['number'], args: [], defaultValues: []}
  const number2 = {key: 'number2', types: ['number'], args: [], defaultValues: ['foo', 'bar']}
  const number3 = {key: 'number3', args: [], defaultValues: []}
  const number4 = {key: 'number4', args: [], defaultValues: ['foo', 'bar']}

  const bool1 = {key: 'bool1', types: ['bool'], args: [], defaultValues: []}
  const bool2 = {key: 'bool2', types: ['bool'], args: [], defaultValues: ['foo', 'bar']}
  const bool3 = {key: 'bool3', types: ['bool'], args: [], defaultValues: []}
  const bool4 = {key: 'bool4', types: ['bool'], args: [], defaultValues: ['foo', 'bar']}

  const flag1 = {key: 'flag1', types: [], args: [], defaultValues: []}
  const flag2 = {key: 'flag2', types: [], args: [], defaultValues: ['foo', 'bar']}
  const flag3 = {key: 'flag3', args: [], defaultValues: []}
  const flag4 = {key: 'flag4', args: [], defaultValues: ['foo', 'bar']}

  const opts = [
    string1, string2, string3, string4,
    number1, number2, number3, number4,
    bool1, bool2, bool3, bool4,
    flag1, flag2, flag3, flag4
  ]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidArity({option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidValues error for incorrect values for string, number, bool, and flag in values', () => {
  const string1 = {key: 'string1', types: ['string'], args: [], values: 42}
  const string2 = {key: 'string2', types: ['string'], args: [], values: {foo: 42}}

  const number1 = {key: 'number1', types: ['number'], args: [], values: 42}
  const number2 = {key: 'number2', types: ['number'], args: [], values: {foo: 42}}

  const bool1 = {key: 'bool1', types: ['bool'], args: [], values: 42}
  const bool2 = {key: 'bool2', types: ['bool'], args: [], values: {foo: 42}}

  const flag1 = {key: 'flag1', types: [], args: [], values: 42}
  const flag2 = {key: 'flag2', types: [], args: [], values: {foo: 42}}

  const opts = [string1, string2, number1, number2, bool1, bool2, flag1, flag2]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidValues({values: option.values, option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidValues error for incorrect values for string, number, bool, and flag in defaultValues', () => {
  const string1 = {key: 'string1', types: ['string'], args: [], defaultValues: 42}
  const string2 = {key: 'string2', types: ['string'], args: [], defaultValues: {foo: 42}}

  const number1 = {key: 'number1', types: ['number'], args: [], defaultValues: 42}
  const number2 = {key: 'number2', types: ['number'], args: [], defaultValues: {foo: 42}}

  const bool1 = {key: 'bool1', types: ['bool'], args: [], defaultValues: 42}
  const bool2 = {key: 'bool2', types: ['bool'], args: [], defaultValues: {foo: 42}}

  const flag1 = {key: 'flag1', types: [], args: [], defaultValues: 42}
  const flag2 = {key: 'flag2', types: [], args: [], defaultValues: {foo: 42}}

  const opts = [string1, string2, number1, number2, bool1, bool2, flag1, flag2]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidValues({defaultValues: option.defaultValues, option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidTypes error for incorrect values for string, number, bool, and flag in values', () => {
  const string0 = {key: 'string', types: 42, args: [], values: ['foo']}
  const number0 = {key: 'number', types: 42, args: [], values: ['42']}
  const bool0 = {key: 'bool', types: 42, args: [], values: ['true']}
  const flag0 = {key: 'flag', types: 42, args: [], values: [1]}

  const opts = [string0, number0, bool0, flag0]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidTypes({types: option.types, option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidTypes error for incorrect values for string, number, bool, and flag in defaultValues', () => {
  const string0 = {key: 'string', types: 42, args: [], defaultValues: ['foo']}
  const number0 = {key: 'number', types: 42, args: [], defaultValues: ['42']}
  const bool0 = {key: 'bool', types: 42, args: [], defaultValues: ['true']}
  const flag0 = {key: 'flag', types: 42, args: [], defaultValues: [1]}

  const opts = [string0, number0, bool0, flag0]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidTypes({types: option.types, option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity works if opts is undefined', () => {
  const obj = {}

  const {opts} = verifyValuesArity(obj)

  expect(opts).toStrictEqual([])
})

test('verifyValuesArity works if input is undefined', () => {
  const {opts} = verifyValuesArity()

  expect(opts).toStrictEqual([])
})

test('verifyValuesArity passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = verifyValuesArity({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})