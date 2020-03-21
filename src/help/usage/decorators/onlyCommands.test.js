const onlyCommands = require('./onlyCommands')
const {command, flag, number} = require('../../../options')
const {optsList} = require('../optsList')

const id = opts => opts

test('onlyCommands README example works', () => {
  const style = {
    cols: [{width: 10, padEnd: 2}, {width: 28}]
  }
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const res = onlyCommands(optsList)(opts)(style)

  const exp = '-h, --help  Prints help.                \n'

  expect(res).toStrictEqual(exp)
})

test('onlyCommands filters one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = onlyCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(2, 3))
})

test('onlyCommands filters more than one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = onlyCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(1, 3))
})

test('onlyCommands returns an empty list if opts are empty', () => {
  const opts = []

  const res = onlyCommands(id)(opts)

  expect(res).toStrictEqual([])
})

test('onlyCommands returns an empty list if opts are undefined', () => {
  const res = onlyCommands(id)()

  expect(res).toStrictEqual([])
})