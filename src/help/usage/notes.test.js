const {notes} = require('./notes')

test('notes generates expected string', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }
  
  const res = notes([
    'Deep Thought was created to come up with the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])(opts)(style)

  const txt = 'Deep Thought was created to come up with\n' +
              'the Answer.                             \n' +
              'To The Ultimate Question of Life, the   \n' +
              'Universe, and Everything.               \n'

  expect(res).toStrictEqual(txt)
})

test('notes retains more than one consecutive whitespace even after line breaks', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }
  
  const res = notes([
    'Deep Thought was created to come up with  the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])(opts)(style)

  const txt = 'Deep Thought was created to come up with\n' +
              '  the Answer.                           \n' +
              'To The Ultimate Question of Life, the   \n' +
              'Universe, and Everything.               \n'

  expect(res).toStrictEqual(txt)
})

test('notes prints the empty string if no strings are given', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }
  
  const res = notes()(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('notes prints the empty string if strings are empty', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }
  
  const res = notes([])(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('notes assumes empty opts if opts is undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = notes([
    'Deep Thought was created to come up with the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])()(style)

  const txt = 'Deep Thought was created to come up with\n' +
              'the Answer.                             \n' +
              'To The Ultimate Question of Life, the   \n' +
              'Universe, and Everything.               \n'

  expect(res).toStrictEqual(txt)
})

test('notes uses default style if style is undefined', () => {
  const opts = []

  const res = notes([
    'Deep Thought was created to come up with the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])(opts)()

  const txt = 'Deep Thought was created to come up with the Answer.                            \n' +
              'To The Ultimate Question of Life, the Universe, and Everything.                 \n'

  expect(res).toStrictEqual(txt)
})