const {anything, array, assert, constant, oneof, property} = require('fast-check')
const parser = require('./parser')

test('parser concats errors', () => {
  const id = a => a

  const initInputResult = (
    oneof(constant(undefined), array(anything(), 1, 5).map(errs => ({errs})))
    .chain(init =>
      oneof(constant(undefined), array(anything(), 1, 5).map(errs => ({errs})))
      .map(input => ({
        init,
        input,
        result: {
          errs: [
            ...((init  || {}).errs || []),
            ...((input || {}).errs || [])
          ],
          argv: []
        }
      }))
    )
  )

  assert(
    property(initInputResult, ({init, input, result}) =>
      expect(
        parser(id)(init)(input)
      ).toStrictEqual(
        result
      )
    )
  )
})