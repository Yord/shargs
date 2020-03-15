const {lines, linesFrom} = require('./lines')

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

test('lines with undefined style uses the default style', () => {
  const res = lines([
    'First line',
    'Last line'
  ])()

  const txt = 'First line                                                                      \n' +
              'Last line                                                                       \n'

  expect(res).toStrictEqual(txt)
})

test('linesFrom correctly passes on id', () => {
  const id = 'test'
  
  const style = {
    [id]: {width: 40}
  }

  const res = linesFrom(id)([
    'First line',
    'Last line'
  ])(style)

  const txt = 'First line                              \n' +
              'Last line                               \n'

  expect(res).toStrictEqual(txt)
})