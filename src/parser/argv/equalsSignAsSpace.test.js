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

test('equalsSignAsSpace does not touch short options with equals sign', () => {
  const obj = {argv: ['-x=foo']}

  const {argv} = equalsSignAsSpace(obj)

  const exp = ['-x=foo']

  expect(argv).toStrictEqual(exp)
})

test('equalsSignAsSpace does not touch options without equals sign', () => {
  const obj = {argv: ['ab']}

  const {argv} = equalsSignAsSpace(obj)

  const exp = ['ab']

  expect(argv).toStrictEqual(exp)
})

test('equalsSignAsSpace works if argv is undefined', () => {
  const obj = {}

  const {argv} = equalsSignAsSpace(obj)

  expect(argv._).toStrictEqual(undefined)
})

test('equalsSignAsSpace works if input is undefined', () => {
  const {argv} = equalsSignAsSpace()

  expect(argv._).toStrictEqual(undefined)
})

test('equalsSignAsSpace passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = equalsSignAsSpace({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})