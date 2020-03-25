const bestGuessOpts = require('./bestGuessOpts')
const {flag, string} = require('../../options')

const noArgs = ({args, ...rest}) => rest

test('bestGuessOpts README example works', () => {
  const obj = {
    opts: [
      noArgs(string('age', ['--age'], {values: ['unknown']})),
      {values: ['--angry']},
      {values: ['--name']},
      {values: ['Logan']},
      {values: ['foo']}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = [
    noArgs(string('age', ['--age'], {values: ['unknown']})),
    noArgs(flag('angry', [], {values: [1]})),
    noArgs(string('name', [], {values: ['Logan']})),
    {values: ['foo']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('bestGuessOpts does not override existing keys', () => {
  const obj = {
    opts: [
      noArgs(string('name', ['--name'], {values: ['Charles']})),
      {values: ['--name']},
      {values: ['Logan']}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('bestGuessOpts does not interpret short options that are too long', () => {
  const obj = {
    opts: [
      noArgs(string('name', ['--name'], {values: ['Charles']})),
      {values: ['-name']},
      {values: ['Logan']}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('bestGuessOpts does work despite getting nonsensical input', () => {
  const obj = {
    opts: [
      noArgs(string('name', ['--name'], {values: ['Charles']})),
      {values: ['--foo']},
      {values: [42]},
      {values: ['-f']},
      {values: [1]},
      {values: ['-h']},
      {values: [{foo: 42}]}
    ]
  }

  const {opts} = bestGuessOpts(obj)

  const exp = [
    noArgs(string('name', ['--name'], {values: ['Charles']})),
    noArgs(flag('foo', [], {values: [1]})),
    {values: [42]},
    noArgs(flag('f', [], {values: [1]})),
    {values: [1]},
    noArgs(flag('h', [], {values: [1]})),
    {values: [{foo: 42}]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('bestGuessOpts works if opts is undefined', () => {
  const obj = {}

  const {opts} = bestGuessOpts(obj)

  expect(opts).toStrictEqual([])
})

test('bestGuessOpts works if input is undefined', () => {
  const {opts} = bestGuessOpts()

  expect(opts).toStrictEqual([])
})