const {line} = require('./line')

test('line generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = line('A line')(style)

  const txt = 'A line                                  \n'

  expect(res).toStrictEqual(txt)
})

test('line with undefined string prints the empty string', () => {
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