const optsMap = require('./optsMap')
const {command, flag, number} = require('../../../options')
const {optsList} = require('../optsList')

const id = opts => opts

test('optsMap README example works', () => {
  const style = {
    cols: [{width: 10, padEnd: 2}, {width: 28}]
  }
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const res = optsMap(opt => ({...opt, args: opt.args.slice(0, 1)}))(optsList)(opts)(style)

  const exp = '-a          The answer. [number]        \n' +
              '-h          Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(exp)
})

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

test('optsMap does not transforms if function is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    command('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = optsMap()(id)(opts)

  const exp = opts

  expect(res).toStrictEqual(exp)
})

test('optsMap returns an empty list if opts are empty', () => {
  const opts = []

  const res = optsMap(
    opt => ({...opt, args: opt.args.length > 0 ? opt.args.slice(0, 1) : []})
  )(id)(opts)

  expect(res).toStrictEqual([])
})

test('optsMap returns an empty list if opts are undefined', () => {
  const res = optsMap(
    opt => ({...opt, args: opt.args.length > 0 ? opt.args.slice(0, 1) : []})
  )(id)()

  expect(res).toStrictEqual([])
})