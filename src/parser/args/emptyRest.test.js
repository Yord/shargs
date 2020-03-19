const emptyRest = require('./emptyRest')

test('emptyRest works as expected', () => {
  const obj = {args: {_: ['foo']}}

  const {args} = emptyRest(obj)

  expect(args._).toStrictEqual([])
})