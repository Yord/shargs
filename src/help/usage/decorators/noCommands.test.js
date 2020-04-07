const noCommands = require('./noCommands')
const {optsList} = require('../optsList')

const id = opts => opts

test('noCommands README example works', () => {
  const style = {
    cols: [{width: 18, padEnd: 2}, {width: 20}]
  }
  
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: null, args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.'}
  ]
  
  const res = noCommands(optsList)(opts)(style)

  const exp = '-a,                 The answer.         \n' +
              '--answer=<number>                       \n' +
              '--version           Prints version.     \n'

  expect(res).toStrictEqual(exp)
})

test('noCommands filters one opt', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: null, args: ['--version'], desc: 'Prints version.'}
  ]

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 2))
})

test('noCommands filters more than one opt', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: null, args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: null, args: ['--version'], desc: 'Prints version.'}
  ]

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 1))
})

test('noCommands returns an empty list if opts are empty', () => {
  const opts = []

  const res = noCommands(id)(opts)

  expect(res).toStrictEqual([])
})

test('noCommands returns an empty list if opts are undefined', () => {
  const res = noCommands(id)()

  expect(res).toStrictEqual([])
})