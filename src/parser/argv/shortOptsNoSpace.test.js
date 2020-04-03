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

test('shortOptsNoSpace works if argv is undefined', () => {
  const obj = {}

  const {argv} = shortOptsNoSpace(obj)

  expect(argv._).toStrictEqual(undefined)
})

test('shortOptsNoSpace works if input is undefined', () => {
  const {argv} = shortOptsNoSpace()

  expect(argv._).toStrictEqual(undefined)
})

test('shortOptsNoSpace passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = shortOptsNoSpace({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})