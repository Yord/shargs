const onlyFirstArg = require('./onlyFirstArg')
const {command, flag, number} = require('../../../options')

const id = opts => opts

test('onlyFirstArg filters one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = onlyFirstArg(id)(opts)

  const exp = [
    number('answer', ['-a'], {desc: 'The answer.'}),
    flag('help', ['-h'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  expect(res).toStrictEqual(exp)
})