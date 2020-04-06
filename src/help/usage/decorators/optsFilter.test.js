const optsFilter = require('./optsFilter')
const {command, flag, number} = require('../../../options')
const {optsList} = require('../optsList')

const id = opts => opts

test('optsFilter README example works', () => {
  const style = {
    cols: [{width: 18, padEnd: 2}, {width: 20}]
  }
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const res = optsFilter(({types}) => types !== null)(optsList)(opts)(style)

  const exp = '-a,                 The answer.         \n' +
              '--answer=<number>                       \n' +
              '--version           Prints version.     \n'

  expect(res).toStrictEqual(exp)
})

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

test('optsFilter returns an empty list if opts are empty', () => {
  const opts = []

  const res = optsFilter(({args}) => args.length > 1)(id)(opts)

  expect(res).toStrictEqual([])
})

test('optsFilter returns an empty list if opts are undefined', () => {
  const res = optsFilter(({args}) => args.length > 1)(id)()

  expect(res).toStrictEqual([])
})