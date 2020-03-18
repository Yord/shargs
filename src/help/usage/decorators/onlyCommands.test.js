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