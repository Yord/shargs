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