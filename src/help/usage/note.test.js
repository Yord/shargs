const {note, noteFrom} = require('./note')

test('note README example works as expected', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.', required: true},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.', defaultValue: [false]},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.', contradicts: ['help']}
  ]
  
  const style = {
    line: {width: 40}
  }
  
  const res = note(
    'Deep Thought was created to come up with the Answer.'
  )(opts)(style)

  const txt = 'Deep Thought was created to come up with\n'+
              'the Answer.                             \n'
  
  expect(res).toStrictEqual(txt)
})

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

test('note assumes empty opts if opts is undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = note('Deep Thought was created to come up with the Answer.')()(style)

  const txt = 'Deep Thought was created to come up with\n' +
              'the Answer.                             \n'

  expect(res).toStrictEqual(txt)
})

test('note uses default style if style has no line attribute', () => {
  const opts = []

  const style = {}

  const res = note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )(opts)(style)

  const txt = 'Deep Thought was created to come up with the Answer to The Ultimate Question of \n' +
              'Life, the Universe, and Everything.                                             \n'

  expect(res).toStrictEqual(txt)
})

test('noteFrom correctly passes on id', () => {
  const id = 'test'

  const opts = []
  
  const style = {
    [id]: {width: 40}
  }

  const res = noteFrom(id)('Deep Thought was created to come up with the Answer.')(opts)(style)

  const txt = 'Deep Thought was created to come up with\n' +
              'the Answer.                             \n'

  expect(res).toStrictEqual(txt)
})

test('noteFrom with wrong id uses default style', () => {
  const id1 = 'test'
  const id2 = 'wrong'

  const opts = []
  
  const style = {
    [id1]: {width: 40}
  }

  const res = noteFrom(id2)(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )(opts)(style)

  const txt = 'Deep Thought was created to come up with the Answer to The Ultimate Question of \n' +
              'Life, the Universe, and Everything.                                             \n'

  expect(res).toStrictEqual(txt)
})