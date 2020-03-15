const {table} = require('./table')

test('table generates expected string', () => {
  const style = {
    cols: [
      {width: 15},
      {width: 25}
    ]
  }
  
  const res = table([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help     Prints the help.         \n' +
              '-v, --version  Prints the version.      \n'

  expect(res).toStrictEqual(txt)
})