const usage              = require('./combinators/usage')
const {note}             = require('./note')
const {space, spaceFrom} = require('./space')

test('space README example works as expected', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = usage([
    note('Deep Thought answered'),
    space,
    note('The Ultimate Question.')
  ])(opts)(style)

  const txt = 'Deep Thought answered                   \n'+
              '                                        \n' +
              'The Ultimate Question.                  \n'
  
  expect(res).toStrictEqual(txt)
})

test('space generates expected string', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = space(opts)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('space uses default style if style is undefined', () => {
  const opts = []

  const res = space(opts)()

  const txt = '                                                                                \n'

  expect(res).toStrictEqual(txt)
})

test('space does not care if opts is undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = space(undefined)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('space uses default style if style has no line attribute', () => {
  const opts = []

  const style = {}

  const res = space(opts)(style)

  const txt = '                                                                                \n'

  expect(res).toStrictEqual(txt)
})

test('spaceFrom correctly passes on id', () => {
  const id = 'test'
  
  const opts = []

  const style = {
    [id]: {width: 40}
  }

  const res = spaceFrom(id)(opts)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('spaceFrom with wrong id uses default style', () => {
  const id1 = 'test'
  const id2 = 'wrong'
  
  const opts = []

  const style = {
    [id1]: {width: 40}
  }

  const res = spaceFrom(id2)(opts)(style)

  const txt = '                                                                                \n'

  expect(res).toStrictEqual(txt)
})