const splitShortOptions = require('./splitShortOptions')

test('splitShortOptions splits short options', () => {
  const obj = {argv: ['-ab']}

  const {argv} = splitShortOptions(obj)

  const exp = ['-a', '-b']

  expect(argv).toStrictEqual(exp)
})

test('splitShortOptions does not touch options with two dashes', () => {
  const obj = {argv: ['--ab']}

  const {argv} = splitShortOptions(obj)

  const exp = ['--ab']

  expect(argv).toStrictEqual(exp)
})