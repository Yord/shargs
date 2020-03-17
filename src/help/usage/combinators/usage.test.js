const usage = require('./usage')
const {command, flag, number} = require('../../../options')

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