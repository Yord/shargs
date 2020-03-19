const layoutMap = require('./layoutMap')
const {line} = require('../line')

test('layoutMap maps layouts over items', () => {
  const style = {
    line: {width: 40}
  }

  const res = layoutMap(line)([
    'One line',
    'And another'
  ])(style)

  const txt = 'One line                                \n' +
              'And another                             \n'

  expect(res).toStrictEqual(txt)
})

test('layoutMap returns empty string if list is empty', () => {
  const style = {
    line: {width: 40}
  }

  const res = layoutMap(line)([])(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('layoutMap returns empty string if list is undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = layoutMap(line)()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('layoutMap returns default style if style is undefined', () => {
  const res = layoutMap(line)([
    'One line',
    'And another'
  ])()

  const txt = 'One line                                                                        \n' +
              'And another                                                                     \n'

  expect(res).toStrictEqual(txt)
})