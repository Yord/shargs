const justArgs = require('./justArgs')
const {command, flag, number} = require('../../../options')

const id = a => a

test('justArgs filters more than one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs(['-a', '-h'])(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 2))
})

test('justArgs filters exactly one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs(['--version'])(id)(opts)

  expect(res).toStrictEqual(opts.slice(2, 3))
})

test('justArgs filters all opts', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs(['-a', '-h', '--version'])(id)(opts)

  expect(res).toStrictEqual(opts)
})

test('justArgs filters no opt if no opt has elements', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs(['--foo'])(id)(opts)

  expect(res).toStrictEqual([])
})

test('justArgs filters no opt if list is empty', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs([])(id)(opts)

  expect(res).toStrictEqual([])
})