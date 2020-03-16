const {synopsis} = require('./synopsis')
const {command, flag, number} = require('../../options')

test('synopsis generates expected string', () => {
  const opts = [
    number('answer', ['-a', '--answer']),
    command('help', ['-h', '--help']),
    flag('version', ['--version'])
  ]

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought', '<QUESTION>')(opts)(style)

  const txt = 'deepThought [-a|--answer] [-h|--help]   \n' +
              '            [--version] <QUESTION>      \n'

  expect(res).toStrictEqual(txt)
})