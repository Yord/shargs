const setDefaultValues = require('./setDefaultValues')
const {number} = require('../../options')

const noArgs = ({args, ...rest}) => rest

test('setDefaultValues works as expected', () => {
  const answer = number('answer', ['-a', '--answer'], {values: [42]})

  const opts = [answer]

  const {opts: opts2} = setDefaultValues(opts)({})

  const exp = opts.map(noArgs)

  expect(opts2).toStrictEqual(exp)
})

test('setDefaultValues does not set default values if the option is present', () => {
  const answer42 = number('answer', ['-a', '--answer'], {values: [42]})
  const answer23 = number('answer', ['-a', '--answer'], {values: [23]})

  const opts = [answer42]

  const {opts: opts2} = setDefaultValues(opts)({
    opts: [answer23]
  })

  const exp = [answer23]

  expect(opts2).toStrictEqual(exp)
})

test('setDefaultValues works if obj is undefined', () => {
  const opts = [number('answer', ['-a', '--answer'], {values: [42]})]

  const obj = {}

  const {opts: opts2} = setDefaultValues(opts)(obj)

  const exp = opts.map(noArgs)

  expect(opts2).toStrictEqual(exp)
})

test('setDefaultValues works if opts is undefined', () => {
  const answer = number('answer', ['-a', '--answer'], {values: [42]})

  const opts = [noArgs(answer)]

  const obj = {opts}

  const {opts: opts2} = setDefaultValues()(obj)

  const exp = opts

  expect(opts2).toStrictEqual(exp)
})

test('setDefaultValues works if obj is undefined', () => {
  const opts = [number('answer', ['-a', '--answer'], {values: [42]})]

  const {opts: opts2} = setDefaultValues(opts)()

  const exp = opts.map(noArgs)

  expect(opts2).toStrictEqual(exp)
})

test('setDefaultValues passes on errors', () => {
  const opts = [number('answer', ['-a', '--answer'], {values: [42]})]

  const ERRS = ['foo']

  const {errs} = setDefaultValues(opts)({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})