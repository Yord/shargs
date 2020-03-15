const {defs, defsFrom} = require('./defs')

test('defs generates expected string', () => {
  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = defs([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help                              \n' +
              '    Prints the help.                    \n' +
              '                                        \n' +
              '-v, --version                           \n' +
              '    Prints the version.                 \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('defsFrom correctly passes on first id', () => {
  const id = 'test'
  
  const style = {
    line: {width: 40},
    test: {width: 20},
    desc: {padStart: 4, width: 36}
  }
  
  const res = defsFrom(id, 'desc')([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help          \n' +
              '    Prints the help.                    \n' +
              '                                        \n' +
              '-v, --version       \n' +
              '    Prints the version.                 \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('defsFrom correctly passes on second id', () => {
  const id = 'test'
  
  const style = {
    line: {width: 40},
    test: {padStart: 4, width: 26},
    desc: {padStart: 4, width: 36}
  }
  
  const res = defsFrom('line', 'test')([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help                              \n' +
              '    Prints the help.          \n' +
              '                                        \n' +
              '-v, --version                           \n' +
              '    Prints the version.       \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})