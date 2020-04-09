const {anything, assert, func, property} = require('fast-check')
const pipe = require('./pipe')

test('pipe composes functions, but backwards', () => {
  const f = func(anything())
  const g = func(anything())
  const a = anything()
  assert(
    property(f, g, a, (f, g, a) => {
      expect(
        pipe(f, g)(a)
      ).toStrictEqual(
        g(f(a))
      )
    })
  )
})

test('pipe is associative', () => {
  const f = func(anything())
  const g = func(anything())
  const h = func(anything())
  const a = anything()
  assert(
    property(f, g, h, a, (f, g, h, a) => {
      expect(
        pipe(f, pipe(g, h))(a)
      ).toStrictEqual(
        pipe(pipe(f, g), h)(a)
      )
    })
  )
})

test('piping f with id is f', () => {
  const id = a => a

  const f  = func(anything())
  const a  = anything()
  assert(
    property(f, a, (f, a) => {
      expect(
        pipe(f, id)(a)
      ).toStrictEqual(
        f(a)
      )
    })
  )
})

test('piping id with f is f', () => {
  const id = a => a

  const f  = func(anything())
  const a  = anything()
  assert(
    property(f, a, (f, a) => {
      expect(
        pipe(id, f)(a)
      ).toStrictEqual(
        f(a)
      )
    })
  )
})