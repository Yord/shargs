const {optsList, optsListFrom} = require('./optsList')
const {command, flag, number} = require('../../options')

test('optsList generates expected string', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '-a,         The answer. [number]        \n' +
              '--answer                                \n' +
              '-h, --help  Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(txt)
})

test('optsList keeps whitespaces if there are several', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The  answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '-a,         The  answer. [number]       \n' +
              '--answer                                \n' +
              '-h, --help  Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(txt)
})

test('optsList prints the empty string if opts are empty', () => {
  const opts = []

  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('optsList prints the empty string if opts is undefined', () => {
  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = optsList()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('optsList prints an empty line if opts has undefined entries', () => {
  const opts = [undefined]

  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('optsList assumes an empty array if no args are given', () => {
  const opts = [
    number('answer', undefined, {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '            The answer. [number]        \n' +
              '-h, --help  Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(txt)
})

test('optsList prints only the type if no desc is given', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '-a,         [number]                    \n' +
              '--answer                                \n' +
              '-h, --help  Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(txt)
})

test('optsList drops all input that have no cols in style', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The  answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    cols: [
      {width: 10, padEnd: 2},
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '-a,         \n' +
              '--answer    \n' +
              '-h, --help  \n' +
              '--version   \n'

  expect(res).toStrictEqual(txt)
})

test('optsList prints the empty strings if style cols are empty', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The  answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    cols: []
  }
  
  const res = optsList(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('optsList uses default cols if style cols are undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {}
  
  const res = optsList(opts)(style)

  const txt = '-a, --answer             The answer. [number]                                   \n' +
              '-h, --help               Prints help.                                           \n' +
              '--version                Prints version. [flag]                                 \n'

  expect(res).toStrictEqual(txt)
})

test('optsList uses default cols if style is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = optsList(opts)()

  const txt = '-a, --answer             The answer. [number]                                   \n' +
              '-h, --help               Prints help.                                           \n' +
              '--version                Prints version. [flag]                                 \n'

  expect(res).toStrictEqual(txt)
})

test('optsList prints extra lines in col even of no input is given', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 23},
      {width: 5}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '-a,         The answer. [number]        \n' +
              '--answer                                \n' +
              '-h, --help  Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(txt)
})

test('optsListFrom correctly passes on id', () => {
  const id = 'test'
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    [id]: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }

  const res = optsListFrom(id)(opts)(style)

  const txt = '-a,         The answer. [number]        \n' +
              '--answer                                \n' +
              '-h, --help  Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(txt)
})

test('optsListFrom with wrong id uses default style', () => {
  const id1 = 'test'
  const id2 = 'wrong'
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    [id1]: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }

  const res = optsListFrom(id2)(opts)(style)

  const txt = '-a, --answer             The answer. [number]                                   \n' +
              '-h, --help               Prints help.                                           \n' +
              '--version                Prints version. [flag]                                 \n'

  expect(res).toStrictEqual(txt)
})