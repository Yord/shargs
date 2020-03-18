const onlyCommands = require('./onlyCommands')
const {command, flag, number} = require('../../../options')

const id = opts => opts

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