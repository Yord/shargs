const addUnusedOpts = require('./addUnusedOpts')
const {number} = require('../../options')

const noArgs = ({args, ...rest}) => rest

test('addUnusedOpts works as expected', () => {
  const answer   = number('answer', ['-a', '--answer'], {values: [42]})
  const question = number('question', ['-q', '--question'])

  const opts = [answer, question]

  const {opts: opts2} = addUnusedOpts(opts)({})

  const exp = opts.map(noArgs)

  expect(opts2).toStrictEqual(exp)
})

test('addUnusedOpts does not set default values if the option is present', () => {
  const answer42 = number('answer', ['-a', '--answer'], {values: [42]})
  const answer23 = number('answer', ['-a', '--answer'], {values: [23]})
  const question = number('question', ['-q', '--question'])

  const opts = [answer42, question]

  const {opts: opts2} = addUnusedOpts(opts)({
    opts: [answer23]
  })

  const exp = [answer23, question].map(noArgs)

  expect(opts2).toStrictEqual(exp)
})

test('addUnusedOpts works if obj is undefined', () => {
  const opts = [number('answer', ['-a', '--answer'], {values: [42]})]

  const obj = {}

  const {opts: opts2} = addUnusedOpts(opts)(obj)

  const exp = opts.map(noArgs)

  expect(opts2).toStrictEqual(exp)
})

test('addUnusedOpts works if opts is undefined', () => {
  const answer = number('answer', ['-a', '--answer'], {values: [42]})

  const opts = [noArgs(answer)]

  const obj = {opts}

  const {opts: opts2} = addUnusedOpts()(obj)

  const exp = opts

  expect(opts2).toStrictEqual(exp)
})

test('addUnusedOpts works if obj is undefined', () => {
  const opts = [number('answer', ['-a', '--answer'], {values: [42]})]

  const {opts: opts2} = addUnusedOpts(opts)()

  const exp = opts.map(noArgs)

  expect(opts2).toStrictEqual(exp)
})

test('addUnusedOpts passes on errors', () => {
  const opts = [number('answer', ['-a', '--answer'], {values: [42]})]

  const ERRS = ['foo']

  const {errs} = addUnusedOpts(opts)({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})