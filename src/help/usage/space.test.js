const {space, spaceFrom} = require('./space')

test('space generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = space(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('spaceFrom correctly passes on id', () => {
  const id = 'test'
  
  const style = {
    [id]: {width: 40}
  }

  const res = spaceFrom(id)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})