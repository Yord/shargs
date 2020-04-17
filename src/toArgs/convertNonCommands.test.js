const convertNonCommands = require('./convertNonCommands')

test('convertNonCommands works as expected', () => {
  const name     = {key: 'name', types: ['string'], args: ['--name'], values: ['Logan']}
  const address  = {key: 'name', types: ['number', 'string'], args: ['--address'], values: [38100, 'Braunschweig']}
  const question = {key: 'question', types: ['string'], args: ['-q'], values: ["What's your lastname?"]}
  const jokingly = {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
  const ask      = {key: 'ask', args: ['ask'], opts: [question, jokingly]}
  const variadic = {key: 'variadic', values: ['1', '2']}
  const weird    = {key: 'weird', types: null, values: ['1', '2']}
  const opts     = [ask, name, address, variadic, weird]

  const {errs, args} = convertNonCommands({opts})

  const expArgs = {
    _: [],
    name: 'Logan',
    variadic: ['1', '2']
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertNonCommands works if opts is undefined', () => {
  const obj = {}

  const {args} = convertNonCommands(obj)

  expect(args).toStrictEqual({_: []})
})

test('convertNonCommands works if input is undefined', () => {
  const {args} = convertNonCommands()

  expect(args).toStrictEqual({_: []})
})

test('convertNonCommands passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = convertNonCommands({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})