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

test('note returns an empty line if no string is given', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = note()(opts)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('note uses default style if style is undefined', () => {
  const opts = []

  const res = note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )(opts)()

  const txt = 'Deep Thought was created to come up with the Answer to The Ultimate Question of \n' +
              'Life, the Universe, and Everything.                                             \n'

  expect(res).toStrictEqual(txt)
})