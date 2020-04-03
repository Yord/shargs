const equalsSignAsSpace = require('./equalsSignAsSpace')

test('equalsSignAsSpace README example works', () => {
  const obj = {argv: ['--name=Logan']}

  const {argv} = equalsSignAsSpace(obj)

  const exp = ['--name', 'Logan']

  expect(argv).toStrictEqual(exp)
})

test('equalsSignAsSpace only replaces first equals sign', () => {
  const obj = {argv: ['--name=Logan=Charles']}

  const {argv} = equalsSignAsSpace(obj)

  const exp = ['--name', 'Logan=Charles']

  expect(argv).toStrictEqual(exp)
})

test('equalsSignAsSpace does not touch options without equals sign', () => {
  const obj = {argv: ['ab']}

  const {argv} = equalsSignAsSpace(obj)

  const exp = ['ab']

  expect(argv).toStrictEqual(exp)
})