const {note} = require('./note')

test('note generates expected string', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = note(
    'Deep Thought was created to come up with the Answer.'
  )(opts)(style)

  const txt = 'Deep Thought was created to come up with\n' +
              'the Answer.                             \n'

  expect(res).toStrictEqual(txt)
})

test('note retains more than one consecutive whitespace even after line breaks', () => {
  const opts = []
  
  const style = {
    line: {width: 40}
  }
  
  const res = note(
    'Deep Thought was created to come up with  the Answer.'
  )(opts)(style)

  const txt = 'Deep Thought was created to come up with\n' +
              '  the Answer.                           \n'

  expect(res).toStrictEqual(txt)
})