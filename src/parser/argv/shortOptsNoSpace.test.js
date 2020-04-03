const shortOptsNoSpace = require('./shortOptsNoSpace')

test('shortOptsNoSpace README example works', () => {
  const obj = {argv: ['-nLogan']}

  const {argv} = shortOptsNoSpace(obj)

  const exp = ['-n', 'Logan']

  expect(argv).toStrictEqual(exp)
})