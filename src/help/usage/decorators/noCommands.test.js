const noCommands = require('./noCommands')
const {command, flag, number} = require('../../../options')
const {optsList} = require('../optsList')

const id = opts => opts

test('noCommands README example works', () => {
  const style = {
    cols: [{width: 10, padEnd: 2}, {width: 28}]
  }
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const res = noCommands(optsList)(opts)(style)

  const exp = '-a,         The answer. [number]        \n' +
              '--answer                                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(exp)
})

test('noCommands filters one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 2))
})

test('noCommands filters more than one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 1))
})

test('noCommands returns an empty list if opts are empty', () => {
  const opts = []

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual([])
})

test('noCommands returns an empty list if opts are undefined', () => {
  const res = noCommands(id)()

  expect(res).toStrictEqual([])
})