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
              '-v, --version                           \n' +
              '    Prints the version.                 \n'

  expect(res).toStrictEqual(txt)
})

test('defs generates string with default style if style is undefined', () => {
  const res = defs([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])()

  const txt = '-h, --help                                                                      \n' +
              '    Prints the help.                                                            \n' +
              '-v, --version                                                                   \n' +
              '    Prints the version.                                                         \n'

  expect(res).toStrictEqual(txt)
})

test('defs uses empty strings if columns are shorter than two elements', () => {
  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = defs([
    [
      '-h, --help'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help                              \n' +
              '                                        \n' +
              '-v, --version                           \n' +
              '    Prints the version.                 \n'

  expect(res).toStrictEqual(txt)
})

test('defs prints empty strings if columns are undefined', () => {
  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = defs()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('defs prints empty lines for each undefined columns entry', () => {
  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = defs([
    [
      '-h, --help',
      'Prints the help.'
    ],
    undefined,
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help                              \n' +
              '    Prints the help.                    \n' +
              '                                        \n' +
              '                                        \n' +
              '-v, --version                           \n' +
              '    Prints the version.                 \n'

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
              '-v, --version       \n' +
              '    Prints the version.                 \n'

  expect(res).toStrictEqual(txt)
})

test('defsFrom correctly passes on second id', () => {
  const id = 'test'
  
  const style = {
    line: {width: 40},
    test: {padStart: 4, width: 26},
    desc: {padStart: 4, width: 36}
  }
  
  const res = defsFrom('line', id)([
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
              '-v, --version                           \n' +
              '    Prints the version.       \n'

  expect(res).toStrictEqual(txt)
})