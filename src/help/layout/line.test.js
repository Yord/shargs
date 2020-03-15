const {line} = require('./line')

test('line generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = line('A line')(style)

  const txt = 'A line                                  \n'

  expect(res).toStrictEqual(txt)
})