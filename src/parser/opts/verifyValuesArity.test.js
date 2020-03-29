const verifyValuesArity = require('./verifyValuesArity')
const {invalidArity, invalidTypes, invalidValues} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

const setTypes = types => ({types: _, ...opt}) => ({
  ...opt,
  ...(typeof types === 'undefined' ? {} : {types})
})

test('verifyValuesArity README example works', () => {
  const name = {...string('name', ['--name']), values: ['Charles', 'Francis']}
  const opts = [name]

  const {errs} = verifyValuesArity({opts})

  const exp = [
    invalidArity({option: name})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity does not throw for correct arities in values', () => {
  const undefinedTypes = setTypes(undefined)

  const opts = [
    undefinedTypes({...string('rest', []), values: ['foo']}),
    {values: ['foo']},

    {...string('string1', []), values: ['string']},
    {...string('string2', []), values: [42]},
    {...string('string3', []), values: null},
    {...string('string4', []), values: undefined},
    string('string5', []),
    
    {...numberBool('numBool1', []), values: ['23', 'true']},
    {...numberBool('numBool2', []), values: [42, 42]},
    {...numberBool('numBool3', []), values: null},
    {...numberBool('numBool4', []), values: undefined},
    numberBool('numBool5', []),

    {...number('answer1', []), values: ['42']},
    {...number('answer2', []), values: [true]},
    {...number('number3', []), values: null},
    {...number('number4', []), values: undefined},
    number('number5', []),
    
    {...bool('verbose1', []), values: ['false']},
    {...bool('verbose2', []), values: [42]},
    {...bool('bool3', []), values: null},
    {...bool('bool4', []), values: undefined},
    bool('bool5', []),
    
    {...flag('flag1', []), values: [1]},
    {...flag('flag2', []), values: ['42']},
    {...flag('flag3', []), values: null},
    {...flag('flag4', []), values: undefined},
    flag('flag5', []),

    {...command('help1', []), values: []},
    {...command('help2', []), values: ['foo']},
    {...command('help3', []), values: ['foo', '--bar']},
    {...command('help4', []), values: ['foo', 42, 'baz']}
  ]

  const {errs} = verifyValuesArity({opts})

  const exp = []

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity does not throw for correct arities in defaultValues', () => {
  const undefinedTypes = setTypes(undefined)

  const opts = [
    undefinedTypes({...string('rest', []), defaultValues: ['foo']}),

    {...string('string1', []), defaultValues: ['string']},
    {...string('string2', []), defaultValues: [42]},
    {...string('string3', []), defaultValues: null},
    {...string('string4', []), defaultValues: undefined},
    
    {...numberBool('numBool1', []), defaultValues: ['23', 'true']},
    {...numberBool('numBool2', []), defaultValues: [42, 42]},
    {...numberBool('numBool3', []), defaultValues: null},
    {...numberBool('numBool4', []), defaultValues: undefined},

    {...number('answer1', []), defaultValues: ['42']},
    {...number('answer2', []), defaultValues: [true]},
    {...number('number3', []), defaultValues: null},
    {...number('number4', []), defaultValues: undefined},
    
    {...bool('verbose1', []), defaultValues: ['false']},
    {...bool('verbose2', []), defaultValues: [42]},
    {...bool('bool3', []), defaultValues: null},
    {...bool('bool4', []), defaultValues: undefined},
    
    {...flag('flag1', []), defaultValues: [1]},
    {...flag('flag2', []), defaultValues: ['42']},
    {...flag('flag3', []), defaultValues: null},
    {...flag('flag4', []), defaultValues: undefined},

    {...command('help1', []), defaultValues: []},
    {...command('help2', []), defaultValues: ['foo']},
    {...command('help3', []), defaultValues: ['foo', '--bar']},
    {...command('help4', []), defaultValues: ['foo', 42, 'baz']}
  ]

  const {errs} = verifyValuesArity({opts})

  const exp = []

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidArity error for incorrect arities for string, number, bool, and flag in values', () => {
  const undefinedTypes = setTypes(undefined)

  const string1 = {...string('string1', []), values: []}
  const string2 = {...string('string2', []), values: ['foo', 'bar']}
  const string3 = undefinedTypes({...string('string3', []), values: []})
  const string4 = undefinedTypes({...string('string4', []), values: ['foo', 'bar']})

  const number1 = {...number('number1', []), values: []}
  const number2 = {...number('number2', []), values: ['foo', 'bar']}
  const number3 = undefinedTypes({...number('number3', []), values: []})
  const number4 = undefinedTypes({...number('number4', []), values: ['foo', 'bar']})

  const bool1 = {...bool('bool1', []), values: []}
  const bool2 = {...bool('bool2', []), values: ['foo', 'bar']}
  const bool3 = undefinedTypes({...bool('bool3', []), values: []})
  const bool4 = undefinedTypes({...bool('bool4', []), values: ['foo', 'bar']})

  const flag1 = {...flag('flag1', []), values: []}
  const flag2 = {...flag('flag2', []), values: ['foo', 'bar']}
  const flag3 = undefinedTypes({...flag('flag3', []), values: []})
  const flag4 = undefinedTypes({...flag('flag4', []), values: ['foo', 'bar']})

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
  const undefinedTypes = setTypes(undefined)

  const string1 = {...string('string1', []), defaultValues: []}
  const string2 = {...string('string2', []), defaultValues: ['foo', 'bar']}
  const string3 = undefinedTypes({...string('string3', []), defaultValues: []})
  const string4 = undefinedTypes({...string('string4', []), defaultValues: ['foo', 'bar']})

  const number1 = {...number('number1', []), defaultValues: []}
  const number2 = {...number('number2', []), defaultValues: ['foo', 'bar']}
  const number3 = undefinedTypes({...number('number3', []), defaultValues: []})
  const number4 = undefinedTypes({...number('number4', []), defaultValues: ['foo', 'bar']})

  const bool1 = {...bool('bool1', []), defaultValues: []}
  const bool2 = {...bool('bool2', []), defaultValues: ['foo', 'bar']}
  const bool3 = undefinedTypes({...bool('bool3', []), defaultValues: []})
  const bool4 = undefinedTypes({...bool('bool4', []), defaultValues: ['foo', 'bar']})

  const flag1 = {...flag('flag1', []), defaultValues: []}
  const flag2 = {...flag('flag2', []), defaultValues: ['foo', 'bar']}
  const flag3 = undefinedTypes({...flag('flag3', []), defaultValues: []})
  const flag4 = undefinedTypes({...flag('flag4', []), defaultValues: ['foo', 'bar']})

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
  const string1 = {...string('string1', []), values: 42}
  const string2 = {...string('string2', []), values: {foo: 42}}

  const number1 = {...number('number1', []), values: 42}
  const number2 = {...number('number2', []), values: {foo: 42}}

  const bool1 = {...bool('bool1', []), values: 42}
  const bool2 = {...bool('bool2', []), values: {foo: 42}}

  const flag1 = {...flag('flag1', []), values: 42}
  const flag2 = {...flag('flag2', []), values: {foo: 42}}

  const opts = [string1, string2, number1, number2, bool1, bool2, flag1, flag2]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidValues({values: option.values, option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidValues error for incorrect values for string, number, bool, and flag in defaultValues', () => {
  const string1 = {...string('string1', []), defaultValues: 42}
  const string2 = {...string('string2', []), defaultValues: {foo: 42}}

  const number1 = {...number('number1', []), defaultValues: 42}
  const number2 = {...number('number2', []), defaultValues: {foo: 42}}

  const bool1 = {...bool('bool1', []), defaultValues: 42}
  const bool2 = {...bool('bool2', []), defaultValues: {foo: 42}}

  const flag1 = {...flag('flag1', []), defaultValues: 42}
  const flag2 = {...flag('flag2', []), defaultValues: {foo: 42}}

  const opts = [string1, string2, number1, number2, bool1, bool2, flag1, flag2]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidValues({defaultValues: option.defaultValues, option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidTypes error for incorrect values for string, number, bool, and flag in values', () => {
  const otherTypes = setTypes(42)
  
  const string0 = otherTypes({...string('string', []), values: ['foo']})
  const number0 = otherTypes({...number('number', []), values: ['42']})
  const bool0 = otherTypes({...bool('bool', []), values: ['true']})
  const flag0 = otherTypes({...flag('flag', []), values: [1]})

  const opts = [string0, number0, bool0, flag0]

  const {errs} = verifyValuesArity({opts})

  const exp = opts.map(option => invalidTypes({types: option.types, option}))

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity throws invalidTypes error for incorrect values for string, number, bool, and flag in defaultValues', () => {
  const otherTypes = setTypes(42)
  
  const string0 = otherTypes({...string('string', []), defaultValues: ['foo']})
  const number0 = otherTypes({...number('number', []), defaultValues: ['42']})
  const bool0 = otherTypes({...bool('bool', []), defaultValues: ['true']})
  const flag0 = otherTypes({...flag('flag', []), defaultValues: [1]})

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