const {optsDefs} = require('./optsDefs')
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