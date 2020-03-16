const {synopsis, synopsisFrom} = require('./synopsis')
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

test('synopsis also works with just the first input', () => {
  const opts = [
    number('answer', ['-a', '--answer']),
    command('help', ['-h', '--help']),
    flag('version', ['--version'])
  ]

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought [-a|--answer] [-h|--help]   \n' +
              '            [--version]                 \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis also works with just the second input', () => {
  const opts = [
    number('answer', ['-a', '--answer']),
    command('help', ['-h', '--help']),
    flag('version', ['--version'])
  ]

  const style = {
    line: {width: 40}
  }

  const res = synopsis(undefined, '<QUESTION>')(opts)(style)

  const txt = '[-a|--answer] [-h|--help] [--version]   \n' +
              '<QUESTION>                              \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis prints start and end only if opts are empty', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought', '<QUESTION>')(opts)(style)

  const txt = 'deepThought <QUESTION>                  \n'

  expect(res).toStrictEqual(txt)
})