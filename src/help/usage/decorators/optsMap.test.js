const optsMap = require('./optsMap')
const {command, flag, number} = require('../../../options')

const id = opts => opts

test('optsMap transforms opts', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = optsMap(
    opt => ({...opt, args: opt.args.length > 0 ? opt.args.slice(0, 1) : []})
  )(id)(opts)

  const exp = [
    number('answer', ['-a'], {desc: 'The answer.'}),
    flag('help', ['-h'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  expect(res).toStrictEqual(exp)
})