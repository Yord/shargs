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