const {space, spaceFrom} = require('./space')

test('space generates expected string', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = space(opts)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('spaceFrom correctly passes on id', () => {
  const id = 'test'
  
  const opts = []

  const style = {
    [id]: {width: 40}
  }

  const res = spaceFrom(id)(opts)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})