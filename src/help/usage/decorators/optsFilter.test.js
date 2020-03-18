const optsFilter = require('./optsFilter')
const {command, flag, number} = require('../../../options')

const id = opts => opts

test('optsFilter filters opts', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = optsFilter(({args}) => args.length > 1)(id)(opts)

  const exp = opts.slice(0, 2)

  expect(res).toStrictEqual(exp)
})

test('optsFilter does not filter if predicate is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = optsFilter()(id)(opts)

  const exp = opts

  expect(res).toStrictEqual(exp)
})