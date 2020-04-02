const arrayOnRepeat = require('./arrayOnRepeat')

test('arrayOnRepeat README example works', () => {
  const obj = {
    opts: [
      {key: 'age', types: ['string'], values: ['42']},
      {key: 'age', types: ['number'], values: [42]}
    ]
  }

  const {opts} = arrayOnRepeat(obj)

  const exp = [
    {key: 'age', types: ['string', 'number'], values: ['42', 42]},
  ]

  expect(opts).toStrictEqual(exp)
})

test('arrayOnRepeat works with arrays', () => {
  const obj = {
    opts: [
      {key: 'numBool', types: ['number', 'bool'], values: ['42', 'true']},
      {key: 'numBool', types: ['number', 'bool'], values: ['23', 'false']}
    ]
  }

  const {opts} = arrayOnRepeat(obj)

  const exp = [
    {key: 'numBool', types: ['number', 'bool', 'number', 'bool'], values: ['42', 'true', '23', 'false']},
  ]

  expect(opts).toStrictEqual(exp)
})