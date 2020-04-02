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