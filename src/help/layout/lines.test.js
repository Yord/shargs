const {lines} = require('./lines')

test('lines generates expected string', () => {
  const style = {
    line: {width: 40}
  }

  const res = lines([
    'First line',
    'Last line'
  ])(style)

  const txt = 'First line                              \n' +
              'Last line                               \n'

  expect(res).toStrictEqual(txt)
})

test('lines with undefined string prints the empty string', () => {
  const style = {
    line: {width: 40}
  }

  const res = lines()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})