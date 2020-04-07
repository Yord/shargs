const failRest = require('./failRest')
const {unexpectedArgument} = require('../errors')

test('failRest README example works', () => {
  const obj = {
    args: {
      _: ['foo'],
      command: {
        _: ['bar'],
        foo: [42, 'foo']
      }
    }
  }

  const {errs, args} = failRest(obj)

  const expErrs = [
    unexpectedArgument({argument: 'foo'}),
    unexpectedArgument({argument: 'bar'})
  ]

  const expArgs = obj.args

  expect(errs).toStrictEqual(expErrs)
  expect(args).toStrictEqual(expArgs)
})

test('failRest even empties rest if args is undefined', () => {
  const obj = {}

  const {args} = failRest(obj)

  expect(args).toStrictEqual({})
})

test('failRest even empties rest if input is undefined', () => {
  const {args} = failRest()

  expect(args).toStrictEqual({})
})

test('failRest passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = failRest({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})