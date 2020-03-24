const errorIfRest = require('./errorIfRest')
const {unexpectedArgument} = require('../../errors')

test('errorIfRest README example works', () => {
  const obj = {
    args: {
      _: ['foo'],
      command: {
        _: ['bar'],
        foo: [42, 'foo']
      }
    }
  }

  const {errs, args} = errorIfRest(obj)

  const expErrs = [
    unexpectedArgument({argument: 'foo'}),
    unexpectedArgument({argument: 'bar'})
  ]

  const expArgs = obj.args

  expect(errs).toStrictEqual(expErrs)
  expect(args).toStrictEqual(expArgs)
})

test('errorIfRest even empties rest if args is undefined', () => {
  const obj = {}

  const {args} = errorIfRest(obj)

  expect(args).toStrictEqual({})
})

test('errorIfRest even empties rest if input is undefined', () => {
  const {args} = errorIfRest()

  expect(args).toStrictEqual({})
})

test('errorIfRest passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = errorIfRest({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})