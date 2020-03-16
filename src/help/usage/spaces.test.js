const {spaces} = require('./spaces')

test('spaces generates expected string', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = spaces(2)(opts)(style)

  const txt = '                                        \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('spaces with undefined length prints one space', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = spaces()(opts)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('spaces uses default style if style is undefined', () => {
  const opts = []

  const res = spaces(2)(opts)()

  const txt = '                                                                                \n' +
              '                                                                                \n'

  expect(res).toStrictEqual(txt)
})

test('spaces does not care if opts is undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = spaces(2)(undefined)(style)

  const txt = '                                        \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('spaces uses default style if style has no line attribute', () => {
  const opts = []

  const style = {}

  const res = spaces(2)(opts)(style)

  const txt = '                                                                                \n' +
              '                                                                                \n'

  expect(res).toStrictEqual(txt)
})