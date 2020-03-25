const verifyValuesArity = require('./verifyValuesArity')
const {invalidArity, invalidTypes, invalidValues} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

const setTypes = types => ({types: _, ...opt}) => ({
  ...opt,
  ...(typeof types === 'undefined' ? {} : {types})
})

test('verifyValuesArity README example works', () => {
  const name = string('name', ['--name'], {values: ['Charles', 'Francis']})
  const opts = [name]

  const {errs} = verifyValuesArity({opts})

  const exp = [
    invalidArity({option: name})
  ]

  expect(errs).toStrictEqual(exp)
})

test('verifyValuesArity does not throw for correct arities', () => {
  const undefinedTypes = setTypes(undefined)

  const opts = [
    undefinedTypes(string('rest', [], {values: ['foo']})),
    {values: ['foo']},

    string('string1', [], {values: ['string']}),
    string('string2', [], {values: [42]}),
    string('string3', [], {values: null}),
    string('string4', [], {values: undefined}),
    string('string5', []),
    
    numberBool('numBool1', [], {values: ['23', 'true']}),
    numberBool('numBool2', [], {values: [42, 42]}),
    numberBool('numBool3', [], {values: null}),
    numberBool('numBool4', [], {values: undefined}),
    numberBool('numBool5', []),

    number('answer1', [], {values: ['42']}),
    number('answer2', [], {values: [true]}),
    number('number3', [], {values: null}),
    number('number4', [], {values: undefined}),
    number('number5', []),
    
    bool('verbose1', [], {values: ['false']}),
    bool('verbose2', [], {values: [42]}),
    bool('bool3', [], {values: null}),
    bool('bool4', [], {values: undefined}),
    bool('bool5', []),
    
    flag('flag1', [], {values: [1]}),
    flag('flag2', [], {values: ['42']}),
    flag('flag3', [], {values: null}),
    flag('flag4', [], {values: undefined}),
    flag('flag5', []),

    command('help1', [], {values: []}),
    command('help2', [], {values: ['foo']}),
    command('help3', [], {values: ['foo', '--bar']}),
    command('help4', [], {values: ['foo', 42, 'baz']})
  ]

  const {errs} = verifyValuesArity({opts})

  const exp = []

  expect(errs).toStrictEqual(exp)
})