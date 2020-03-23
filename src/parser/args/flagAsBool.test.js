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