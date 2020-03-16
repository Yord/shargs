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

test('space uses default style if style is undefined', () => {
  const opts = []

  const res = space(opts)()

  const txt = '                                                                                \n'

  expect(res).toStrictEqual(txt)
})

test('space does not care if opts is undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = space(undefined)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('space uses default style if style has no line attribute', () => {
  const opts = []

  const style = {}

  const res = space(opts)(style)

  const txt = '                                                                                \n'

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