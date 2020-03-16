const {optsDefs, optsDefsFrom} = require('./optsDefs')
const {command, flag, number} = require('../../options')

test('optsDefs generates expected string', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefs(opts)(style)

  const txt = '-a, --answer [number]                   \n' +
              '    The answer.                         \n' +
              '                                        \n' +
              '-h, --help                              \n' +
              '    Prints help.                        \n' +
              '                                        \n' +
              '--version [flag]                        \n' +
              '    Prints version.                     \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('optsDefs prints an empty string if opts are empty', () => {
  const opts = []

  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefs(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('optsDefs prints three empty lines if opts has undefined entries', () => {
  const opts = [undefined]

  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefs(opts)(style)

  const txt = '                                        \n' +
              '                                        \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('optsDefs assumes an empty array if no args are given', () => {
  const opts = [
    number('answer', undefined, {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefs(opts)(style)

  const txt = ' [number]                               \n' +
              '    The answer.                         \n' +
              '                                        \n' +
              '-h, --help                              \n' +
              '    Prints help.                        \n' +
              '                                        \n' +
              '--version [flag]                        \n' +
              '    Prints version.                     \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('optsDefs generates string with default style if style is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = optsDefs(opts)()

  const txt = '-a, --answer [number]                                                           \n' +
              '    The answer.                                                                 \n' +
              '                                                                                \n' +
              '-h, --help                                                                      \n' +
              '    Prints help.                                                                \n' +
              '                                                                                \n' +
              '--version [flag]                                                                \n' +
              '    Prints version.                                                             \n' +
              '                                                                                \n'

  expect(res).toStrictEqual(txt)
})

test('optsDefs prints an empty line if no desc is given', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help']),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefs(opts)(style)

  const txt = '-a, --answer [number]                   \n' +
              '    The answer.                         \n' +
              '                                        \n' +
              '-h, --help                              \n' +
              '                                        \n' +
              '                                        \n' +
              '--version [flag]                        \n' +
              '    Prints version.                     \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('optsDefs prints empty strings if opts are undefined', () => {
  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefs()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('optsDefsFrom correctly passes on first id', () => {
  const id = 'test'
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40},
    test: {width: 25},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefsFrom(id, 'desc')(opts)(style)

  const txt = '-a, --answer [number]    \n' +
              '    The answer.                         \n' +
              '                                        \n' +
              '-h, --help               \n' +
              '    Prints help.                        \n' +
              '                                        \n' +
              '--version [flag]         \n' +
              '    Prints version.                     \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})

test('optsDefsFrom correctly passes on second id', () => {
  const id = 'test'
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40},
    test: {padStart: 4, width: 26},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefsFrom('line', id)(opts)(style)

  const txt = '-a, --answer [number]                   \n' +
              '    The answer.               \n' +
              '                                        \n' +
              '-h, --help                              \n' +
              '    Prints help.              \n' +
              '                                        \n' +
              '--version [flag]                        \n' +
              '    Prints version.           \n' +
              '                                        \n'

  expect(res).toStrictEqual(txt)
})