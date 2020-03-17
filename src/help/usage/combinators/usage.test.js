const usage = require('./usage')
const {optsList} = require('../optsList')
const {command, flag, number} = require('../../../options')

test('usage generates expected string', () => {
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

  const res = usage([
    optsList
  ])(opts)(style)

  const txt = '-a,         The answer. [number]        \n' +
              '--answer                                \n' +
              '-h, --help  Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(txt)
})

test('usage returns the empty string if no functions are defined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40}
  }

  const res = usage()(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('usage returns the empty string if functions are empty', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40}
  }

  const res = usage([])(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})

test('usage uses default style if style is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = usage([
    optsList
  ])(opts)()

  const txt = '-a, --answer             The answer. [number]                                   \n' +
              '-h, --help               Prints help.                                           \n' +
              '--version                Prints version. [flag]                                 \n'

  expect(res).toStrictEqual(txt)
})

test('usage passes on empty opts if opts are undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = usage([
    optsList
  ])()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})