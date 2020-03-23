const emptyRest = require('./emptyRest')

test('emptyRest README example works', () => {
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

test('emptyRest passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = emptyRest({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})