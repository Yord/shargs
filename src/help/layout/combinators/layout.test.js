const layout = require('./layout')
const {line} = require('../line')

test('layout returns the empty string if no functions are defined', () => {
  const style = {
    line: {width: 40}
  }

  const res = layout()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('layout uses default style if style is undefined', () => {
  const res = layout([
    line('layout uses default style if style is undefined')
  ])()

  const txt = 'layout uses default style if style is undefined                                 \n'

  expect(res).toStrictEqual(txt)
})