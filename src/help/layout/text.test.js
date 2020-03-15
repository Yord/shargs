const {text} = require('./text')

test('text generates expected string', () => {
  const style = {
    line: {width: 40}
  }
  
  const res = text('Deep Thought was created to come up with the Answer.')(style)

  const txt = 'Deep Thought was created to come up with\n' +
              'the Answer.                             \n'

  expect(res).toStrictEqual(txt)
})

test('text retains more than one consecutive whitespace even after line breaks', () => {
  const style = {
    line: {width: 40}
  }
  
  const res = text('Deep Thought was created to come up with  the Answer.')(style)

  const txt = 'Deep Thought was created to come up with\n' +
              '  the Answer.                           \n'

  expect(res).toStrictEqual(txt)
})

test('text prints an empty line if no string is given', () => {
  const style = {
    line: {width: 40}
  }
  
  const res = text()(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('text uses default style if style is undefined', () => {
  const res = text('Deep Thought was created to come up with the Answer.')()

  const txt = 'Deep Thought was created to come up with the Answer.                            \n'

  expect(res).toStrictEqual(txt)
})