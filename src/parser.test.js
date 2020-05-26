const {parser} = require('.')

test('parser works with undefined stages', () => {
  const stages = undefined

  const parsers = {}

  const arc = {key: 'arc', args: ['-a'], types: ['A']}

  const opt = {
    key: 'Foo',
    opts: [
      arc
    ]
  }

  const argv = ['-a', '1']

  const errs = []

  const res = parser(stages, parsers)(opt)(argv, errs)

  const exp = {
    errs: [],
    args: {
      _: [],
      arc: '1'
    }
  }

  expect(res).toStrictEqual(exp)
})