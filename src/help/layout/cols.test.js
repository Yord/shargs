const {cols} = require('./cols')

test('cols generates expected string', () => {
  const style = {
    cols: [
      {width: 15},
      {width: 25}
    ]
  }

  const res = cols([
    [
      '-h, --help',
      '-v, --version'
    ],
    [
      'Prints the help.',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help     Prints the help.         \n' +
              '-v, --version  Prints the version.      \n'

  expect(res).toStrictEqual(txt)
})

test('cols with default columns generates expected string', () => {
  const style = {
    cols: [
      {width: 15},
      {width: 25}
    ]
  }

  const res = cols()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})