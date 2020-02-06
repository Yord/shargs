const {anything, assert, func, property} = require('fast-check')
const compose = require('./compose')

test('compose composes functions', () => {
  const f = func(anything())
  const g = func(anything())
  const a = anything()
  assert(
    property(f, g, a, (f, g, a) => {
      expect(
        compose(f, g)(a)
      ).toStrictEqual(
        f(g(a))
      )
    })
  )
})

test('compose is associative', () => {
  const f = func(anything())
  const g = func(anything())
  const h = func(anything())
  const a = anything()
  assert(
    property(f, g, h, a, (f, g, h, a) => {
      expect(
        compose(f, compose(g, h))(a)
      ).toStrictEqual(
        compose(compose(f, g), h)(a)
      )
    })
  )
})

test('composing f with id is f', () => {
  const id = a => a

  const f  = func(anything())
  const a  = anything()
  assert(
    property(f, a, (f, a) => {
      expect(
        compose(f, id)(a)
      ).toStrictEqual(
        f(a)
      )
    })
  )
})

test('composing id with f is f', () => {
  const id = a => a

  const f  = func(anything())
  const a  = anything()
  assert(
    property(f, a, (f, a) => {
      expect(
        compose(id, f)(a)
      ).toStrictEqual(
        f(a)
      )
    })
  )
})