const decorate   = require('./decorate')
const justArgs   = require('../justArgs')
const noCommands = require('../noCommands')
const {command, flag, number} = require('../../../../options')

const id = opts => opts

test('decorate combines decorators', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = decorate(
    justArgs(['-a', '-h']),
    noCommands
  )(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 1))
})