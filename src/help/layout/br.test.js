const {br, brFrom} = require('./br')

test('br generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = br(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('brFrom correctly passes on id', () => {
  const id = 'test'
  
  const style = {
    [id]: {width: 40}
  }

  const res = brFrom(id)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})