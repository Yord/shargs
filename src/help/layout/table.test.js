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

test('table drops all input that have no cols in style', () => {
  const style = {
    cols: [
      {width: 12}
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

  const txt = '-h, --help  \n' +
              '-v,         \n' +
              '--version   \n'

  expect(res).toStrictEqual(txt)
})

test('table prints extra lines in col even of no input is given', () => {
  const style = {
    cols: [
      {width: 12},
      {width: 23},
      {width: 5}
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