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