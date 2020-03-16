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

test('synopsis prints start and end only if opts are undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought', '<QUESTION>')()(style)

  const txt = 'deepThought <QUESTION>                  \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis prints start and end only if opts contains undefined values', () => {
  const opts = [undefined]

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought', '<QUESTION>')(opts)(style)

  const txt = 'deepThought <QUESTION>                  \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis assumes an empty array if no args are given', () => {
  const opts = [
    number('answer', undefined, {desc: 'The answer.'}),
    command('help', undefined, {desc: 'Prints help.'}),
    flag('version', undefined, {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought', '<QUESTION>')(opts)(style)

  const txt = 'deepThought <QUESTION>                  \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis uses default line if style line is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer']),
    command('help', ['-h', '--help']),
    flag('version', ['--version'])
  ]

  const style = {}

  const res = synopsis('deepThought', '<QUESTION>')(opts)(style)

  const txt = 'deepThought [-a|--answer] [-h|--help] [--version] <QUESTION>                    \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis uses default line if style is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer']),
    command('help', ['-h', '--help']),
    flag('version', ['--version'])
  ]

  const res = synopsis('deepThought', '<QUESTION>')(opts)()

  const txt = 'deepThought [-a|--answer] [-h|--help] [--version] <QUESTION>                    \n'

  expect(res).toStrictEqual(txt)
})

test('synopsisFrom correctly passes on id', () => {
  const id = 'test'
  
  const opts = [
    number('answer', ['-a', '--answer']),
    command('help', ['-h', '--help']),
    flag('version', ['--version'])
  ]

  const style = {
    [id]: [
      {width: 15},
      {width: 25}
    ]
  }

  const res = synopsisFrom(id)('deepThought', '<QUESTION>')(opts)(style)

  const txt = 'deepThought    [-a|--answer] [-h|--help]\n' +
              '               [--version] <QUESTION>   \n'

  expect(res).toStrictEqual(txt)
})