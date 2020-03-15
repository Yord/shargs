const {table} = require('./table')

test('table generates expected string', () => {
  const style = {
    cols: [
      {width: 12},
      {width: 28}
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

  const txt = '-h, --help  Prints the help.            \n' +
              '-v,         Prints the version.         \n' +
              '--version                               \n'

  expect(res).toStrictEqual(txt)
})