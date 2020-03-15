const {cols, colsFrom} = require('./cols')

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

test('cols still work if style has too few entries', () => {
  const style = {
    cols: [
      {width: 15}
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

  const txt = '-h, --help     Prints the help.\n' +
              '-v, --version  Prints the version.\n'

  expect(res).toStrictEqual(txt)
})

test('cols still work if style has no entries', () => {
  const style = {
    cols: []
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

  const txt = '-h, --helpPrints the help.\n' +
              '-v, --versionPrints the version.\n'

  expect(res).toStrictEqual(txt)
})

test('cols with unaligned columns renders correctly', () => {
  const style = {
    cols: [
      {width: 15},
      {width: 25}
    ]
  }

  const res = cols([
    [
      '-h, --help',
      '-v,',
      '--version'
    ],
    [
      'Prints the help.'
    ]
  ])(style)

  const txt = '-h, --help     Prints the help.         \n' +
              '-v,                                     \n' +
              '--version                               \n'

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

test('cols with default style generates expected string', () => {
  const res = cols([
    [
      '-h, --help',
      '-v, --version'
    ],
    [
      'Prints the help.',
      'Prints the version.'
    ]
  ])()

  const txt = '-h, --help               Prints the help.                                       \n' +
              '-v, --version            Prints the version.                                    \n'

  expect(res).toStrictEqual(txt)
})

test('colsFrom correctly passes on id', () => {
  const id = 'test'
  
  const style = {
    [id]: [
      {width: 15},
      {width: 25}
    ]
  }

  const res = colsFrom(id)([
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

test('colsFrom with wrong id uses default style', () => {
  const id1 = 'test'
  const id2 = 'wrong'
  
  const style = {
    [id1]: [
      {width: 15},
      {width: 25}
    ]
  }

  const res = colsFrom(id2)([
    [
      '-h, --help',
      '-v, --version'
    ],
    [
      'Prints the help.',
      'Prints the version.'
    ]
  ])(style)

  const txt = '-h, --help               Prints the help.                                       \n' +
              '-v, --version            Prints the version.                                    \n'

  expect(res).toStrictEqual(txt)
})