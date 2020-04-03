const {anything, assert, boolean, func, property} = require('fast-check')
const and = require('./and')

const pred = () => func(boolean())

const T = () => true

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

test('and follows right identity', () => {
  const p = pred()
  const a = anything()
  assert(
    property(p, a, (p, a) => {
      expect(
        and(p, T)(a)
      ).toStrictEqual(
        p(a)
      )
    })
  )
})

test('and follows left identity', () => {
  const p = pred()
  const a = anything()
  assert(
    property(p, a, (p, a) => {
      expect(
        and(T, p)(a)
      ).toStrictEqual(
        p(a)
      )
    })
  )
})