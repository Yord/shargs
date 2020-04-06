const usage                = require('./combinators/usage')
const {note}               = require('./note')
const {spaces, spacesFrom} = require('./spaces')

test('spaces README example works as expected', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = usage([
    note('Deep Thought answered'),
    spaces(2),
    note('The Ultimate Question.')
  ])(opts)(style)

  const txt = 'Deep Thought answered                   \n'+
              '                                        \n' +
              '                                        \n' +
              'The Ultimate Question.                  \n'
  
  expect(res).toStrictEqual(txt)
})
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

test('spacesFrom correctly passes on id', () => {
  const id = 'test'
  
  const opts = []

  const style = {
    [id]: {width: 40}
  }

  const res = spacesFrom(id)(2)(opts)(style)

  const txt = '                                        \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('spacesFrom with wrong id uses default style', () => {
  const id1 = 'test'
  const id2 = 'wrong'
  
  const opts = []

  const style = {
    [id1]: {width: 40}
  }

  const res = spacesFrom(id2)(2)(opts)(style)

  const txt = '                                                                                \n' +
              '                                                                                \n'

  expect(res).toStrictEqual(txt)
})