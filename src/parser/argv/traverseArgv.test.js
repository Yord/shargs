const traverseArgv = require('./traverseArgv')

const tautology = _ => true

test('traverseArgv README example works', () => {
  const obj = {
    argv: [
      '--age=42',
      '--help'
    ]
  }

  const hasEqualsSign = arg => arg.indexOf('=') > -1

  const replaceFirstEqualsSignWithSpace = arg => ({
    argv: [
      arg.slice(0, arg.indexOf('=')),
      arg.slice(arg.indexOf('=') + 1)
    ]
  })

  const {errs, argv} = traverseArgv(hasEqualsSign)(replaceFirstEqualsSignWithSpace)(obj)

  const expArgv = [
    '--age', '42',
      '--help'
  ]

  const expErrs = []

  expect(argv).toStrictEqual(expArgv)
  expect(errs).toStrictEqual(expErrs)
})

test('traverseArgv does not apply function if predicate is undefined', () => {
  const obj = {
    argv: [
      '--age=42',
      '--help'
    ]
  }

  const recordError = _ => ({
    errs: ['Error']
  })

  const {errs, argv} = traverseArgv()(recordError)(obj)

  const expArgv = obj.argv

  const expErrs = []

  expect(argv).toStrictEqual(expArgv)
  expect(errs).toStrictEqual(expErrs)
})

test('traverseArgv applies identity function if function is undefined', () => {
  const obj = {
    argv: [
      '--age=42',
      '--help'
    ]
  }

  const {errs, argv} = traverseArgv(tautology)()(obj)

  const expArgv = obj.argv

  const expErrs = []

  expect(argv).toStrictEqual(expArgv)
  expect(errs).toStrictEqual(expErrs)
})

test('traverseArgv works if argv is undefined', () => {
  const obj = {}

  const {argv} = traverseArgv(tautology)()(obj)

  expect(argv).toStrictEqual([])
})

test('traverseArgv works if input is undefined', () => {
  const {argv} = traverseArgv(tautology)()()

  expect(argv).toStrictEqual([])
})

test('traverseArgv passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = traverseArgv(tautology)()({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})