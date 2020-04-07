const optsMap = require('./optsMap')
const {optsList} = require('../optsList')

const id = opts => opts

test('optsMap README example works', () => {
  const style = {
    cols: [{width: 18, padEnd: 2}, {width: 20}]
  }
  
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: null, args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.'}
  ]
  
  const res = optsMap(opt => ({...opt, args: opt.args.slice(0, 1)}))(optsList)(opts)(style)

  const exp = '-a <number>         The answer.         \n' +
              '-h                  Prints help.        \n' +
              '--version           Prints version.     \n'

  expect(res).toStrictEqual(exp)
})

test('optsMap transforms opts', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: null, args: ['--version'], desc: 'Prints version.'}
  ]

  const res = optsMap(
    opt => ({...opt, args: opt.args.length > 0 ? opt.args.slice(0, 1) : []})
  )(id)(opts)

  const exp = [
    {key: 'answer', types: ['number'], args: ['-a'], desc: 'The answer.'},
    {key: 'help', types: [], args: ['-h'], desc: 'Prints help.'},
    {key: 'version', types: null, args: ['--version'], desc: 'Prints version.'}
  ]

  expect(res).toStrictEqual(exp)
})

test('optsMap does not transforms if function is undefined', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: null, args: ['--version'], desc: 'Prints version.'}
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