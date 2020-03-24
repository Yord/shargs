const clearRest = require('./clearRest')

test('clearRest README example works', () => {
  const obj = {args: {_: ['foo']}}

  const {args} = clearRest(obj)

  expect(args._).toStrictEqual([])
})

test('clearRest even empties rest if args is undefined', () => {
  const obj = {}

  const {args} = clearRest(obj)

  expect(args._).toStrictEqual([])
})

test('clearRest even empties rest if input is undefined', () => {
  const {args} = clearRest()

  expect(args._).toStrictEqual([])
})

test('clearRest passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = clearRest({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})