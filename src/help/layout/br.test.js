const {br} = require('./br')

test('br generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = br(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})