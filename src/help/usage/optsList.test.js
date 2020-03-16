const {optsList} = require('./optsList')
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