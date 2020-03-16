const {space} = require('./space')

test('space generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = space(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})