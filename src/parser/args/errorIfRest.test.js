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