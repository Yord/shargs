const usageMap = require('./usageMap')
const {text, textFrom} = require('../../layout/text')
const layout = require('../../layout/combinators/layout')
const {command, flag, number} = require('../../../options')

test('usageMap generates expected string', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = usageMap(({args, desc}) => layout([
    text(args.join(', ')),
    textFrom('desc')(desc)
  ]))(opts)(style)

  const txt = '-a, --answer                            \n' +
              '    The answer.                         \n' +
              '-h, --help                              \n' +
              '    Prints help.                        \n' +
              '--version                               \n' +
              '    Prints version.                     \n'

  expect(res).toStrictEqual(txt)
})

test('usageMap returns empty string if opts are undefined', () => {
  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = usageMap(({args, desc}) => layout([
    text(args.join(', ')),
    textFrom('desc')(desc)
  ]))()(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})