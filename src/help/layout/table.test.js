const {table, tableFrom} = require('./table')

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

test('table does not print a column where all values are empty', () => {
  const style = {
    cols: [
      {width: 10},
      {width: 30}
    ]
  }
  
  const res = table([
    [
      '',
      'Prints the help.'
    ],
    [
      '',
      'Prints the version.'
    ]
  ])(style)

  const txt = '          Prints the help.              \n' +
              '          Prints the version.           \n'

  expect(res).toStrictEqual(txt)
})

test('table does not print a column when its width is 0 1/2', () => {
  const style = {
    cols: [
      {width: 0},
      {width: 40}
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

  const txt = 'Prints the help.                        \n' +
              'Prints the version.                     \n'

  expect(res).toStrictEqual(txt)
})

test('table keeps whitespaces if there are several', () => {
  const style = {
    cols: [
      {width: 12},
      {width: 28}
    ]
  }
  
  const res = table([
    [
      '-h, --help',
      'Prints  the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help  Prints  the help.           \n' +
              '-v,         Prints the version.         \n' +
              '--version                               \n'

  expect(res).toStrictEqual(txt)
})

test('table keeps whitespaces if there are several even after word breaks', () => {
  const style = {
    cols: [
      {width: 12},
      {width: 16}
    ]
  }
  
  const res = table([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the        version.'
    ]
  ])(style)

  const txt = '-h, --help  Prints the help.\n' +
              '-v,         Prints the      \n' +
              '--version           version.\n'

  expect(res).toStrictEqual(txt)
})

test('table keeps whitespaces if there are more than 1 even after word breaks', () => {
  const style = {
    cols: [
      {width: 12},
      {width: 10}
    ]
  }
  
  const res = table([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the  version.'
    ]
  ])(style)

  const txt = '-h, --help  Prints the\n' +
              '            help.     \n' +
              '-v,         Prints the\n' +
              '--version     version.\n'

  expect(res).toStrictEqual(txt)
})

test('table prints the empty string if an empty items list is given', () => {
  const style = {
    cols: [
      {width: 12},
      {width: 28}
    ]
  }
  
  const res = table([])(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('table prints the empty string if the items list is undefined', () => {
  const style = {
    cols: [
      {width: 12},
      {width: 28}
    ]
  }
  
  const res = table()(style)

  const txt = ''

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

test('table prints the empty strings if style cols are empty', () => {
  const style = {
    cols: []
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

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('table uses default cols if style cols are undefined', () => {
  const style = {}
  
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

  const txt = '-h, --help               Prints the help.                                       \n' +
              '-v, --version            Prints the version.                                    \n'

  expect(res).toStrictEqual(txt)
})

test('table uses default cols if style is undefined', () => {
  const res = table([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])()

  const txt = '-h, --help               Prints the help.                                       \n' +
              '-v, --version            Prints the version.                                    \n'

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

test('tableFrom correctly passes on id', () => {
  const id = 'test'
  
  const style = {
    [id]: [
      {width: 12},
      {width: 28}
    ]
  }

  const res = tableFrom(id)([
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

test('tableFrom with wrong id uses default style', () => {
  const id1 = 'test'
  const id2 = 'wrong'
  
  const style = {
    [id1]: [
      {width: 12},
      {width: 28}
    ]
  }

  const res = tableFrom(id2)([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help               Prints the help.                                       \n' +
              '-v, --version            Prints the version.                                    \n'

  expect(res).toStrictEqual(txt)
})