const onlyCommands = require('./onlyCommands')
const {optsList} = require('../optsList')

const id = opts => opts

test('onlyCommands README example works', () => {
  const style = {
    cols: [{width: 10, padEnd: 2}, {width: 28}]
  }
  
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: null, args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.'}
  ]
  
  const res = onlyCommands(optsList)(opts)(style)

  const exp = '-h, --help  Prints help.                \n'

  expect(res).toStrictEqual(exp)
})

test('onlyCommands filters one opt', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: null, args: ['--version'], desc: 'Prints version.'}
  ]

  const res = onlyCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(2, 3))
})

test('onlyCommands filters more than one opt', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: null, args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: null, args: ['--version'], desc: 'Prints version.'}
  ]

  const res = onlyCommands(id)(opts)

  expect(res).toStrictEqual(opts.slice(1, 3))
})

test('onlyCommands returns an empty list if opts are empty', () => {
  const opts = []

  const res = onlyCommands(id)(opts)

  expect(res).toStrictEqual([])
})

test('onlyCommands returns an empty list if opts are undefined', () => {
  const res = onlyCommands(id)()

  expect(res).toStrictEqual([])
})