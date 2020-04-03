const shortOptsNoSpace = require('./shortOptsNoSpace')

test('shortOptsNoSpace README example works', () => {
  const obj = {argv: ['-nLogan']}

  const {argv} = shortOptsNoSpace(obj)

  const exp = ['-n', 'Logan']

  expect(argv).toStrictEqual(exp)
})

test('shortOptsNoSpace does not touch options without single minus sign', () => {
  const obj = {argv: ['abc', '--nLogan']}

  const {argv} = shortOptsNoSpace(obj)

  const exp = ['abc', '--nLogan']

  expect(argv).toStrictEqual(exp)
})