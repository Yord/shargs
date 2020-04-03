const traverseArgv = require('./traverseArgv')

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