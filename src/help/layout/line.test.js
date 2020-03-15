const {line, lineFrom} = require('./line')

test('line generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = line('A line')(style)

  const txt = 'A line                                  \n'

  expect(res).toStrictEqual(txt)
})

test('line with undefined string prints an empty line', () => {
  const style = {
    line: {width: 40}
  }

  const res = line()(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('line with undefined style uses the default style', () => {
  const res = line('A line')()

  const txt = 'A line                                                                          \n'

  expect(res).toStrictEqual(txt)
})

test('lineFrom correctly passes on id', () => {
  const id = 'test'
  
  const style = {
    [id]: {width: 40}
  }

  const res = lineFrom(id)('A line')(style)

  const txt = 'A line                                  \n'

  expect(res).toStrictEqual(txt)
})