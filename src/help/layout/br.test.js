const {br} = require('./br')

test('br layouts as expected', () => {
  const style = {
    line: {width: 40}
  }

  const res = br(style)

  const foo = '                                        \n'

  expect(res).toStrictEqual(foo)
})