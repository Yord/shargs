const {anything, assert, boolean, func, property} = require('fast-check')
const and = require('./and')

const pred = () => func(boolean())

test('and is associative', () => {
  const p = pred()
  const q = pred()
  const r = pred()
  const a = anything()
  assert(
    property(p, q, r, a, (p, q, r, a) => {
      expect(
        and(p, and(q, r))(a)
      ).toStrictEqual(
        and(and(p, q), r)(a)
      )
    })
  )
})