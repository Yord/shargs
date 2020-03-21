const onlyFirstArg = require('./onlyFirstArg')
const {command, flag, number} = require('../../../options')
const {optsList} = require('../optsList')

const id = opts => opts

test('onlyFirstArg README example works', () => {
  const style = {
    cols: [{width: 10, padEnd: 2}, {width: 28}]
  }
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const res = onlyFirstArg(optsList)(opts)(style)

  const exp = '-a          The answer. [number]        \n' +
              '-h          Prints help.                \n' +
              '--version   Prints version. [flag]      \n'

  expect(res).toStrictEqual(exp)
})

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

test('onlyFirstArg returns empty array if args is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    {key: 'version', args: undefined, types: null, desc: 'Prints version.'}
  ]

  const res = onlyFirstArg(id)(opts)

  const exp = [
    number('answer', ['-a'], {desc: 'The answer.'}),
    flag('help', ['-h'], {desc: 'Prints help.'}),
    {key: 'version', args: [], types: null, desc: 'Prints version.'}
  ]

  expect(res).toStrictEqual(exp)
})

test('onlyFirstArg returns an empty list if opts are empty', () => {
  const opts = []

  const res = onlyFirstArg(id)(opts)

  expect(res).toStrictEqual([])
})

test('onlyFirstArg returns an empty list if opts are undefined', () => {
  const res = onlyFirstArg(id)()

  expect(res).toStrictEqual([])
})