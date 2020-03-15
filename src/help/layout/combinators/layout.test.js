const layout = require('./layout')

test('layout returns the empty string if no functions are defined', () => {
  const style = {
    line: {width: 40}
  }

  const res = layout()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})