const emptyRest = require('./emptyRest')

test('emptyRest works as expected', () => {
  const obj = {args: {_: ['foo']}}

  const {args} = emptyRest(obj)

  expect(args._).toStrictEqual([])
})

test('emptyRest even empties rest if args is undefined', () => {
  const obj = {}

  const {args} = emptyRest(obj)

  expect(args._).toStrictEqual([])
})

test('emptyRest even empties rest if input is undefined', () => {
  const {args} = emptyRest()

  expect(args._).toStrictEqual([])
})