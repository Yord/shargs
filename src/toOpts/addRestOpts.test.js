const addRestOpts = require('./addRestOpts')

test('addRestOpts works as expected', () => {
  const answer   = {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: [42]}
  const question = {key: 'question', types: ['number'], args: ['-q', '--question']}

  const opts = [answer, question]

  const {opts: opts2} = addRestOpts(opts)({})

  const exp = opts

  expect(opts2).toStrictEqual(exp)
})

test('addRestOpts does not set default values if the option is present', () => {
  const answer42 = {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: [42]}
  const answer23 = {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: [23]}
  const question = {key: 'question', types: ['number'], args: ['-q', '--question']}

  const opts = [answer42, question]

  const {opts: opts2} = addRestOpts(opts)({
    opts: [answer23]
  })

  const exp = [answer23, question]

  expect(opts2).toStrictEqual(exp)
})

test('addRestOpts works if obj is undefined', () => {
  const opts = [{key: 'answer', types: ['number'], args: ['-a', '--answer'], values: [42]}]

  const obj = {}

  const {opts: opts2} = addRestOpts(opts)(obj)

  const exp = opts

  expect(opts2).toStrictEqual(exp)
})

test('addRestOpts works if opts is undefined', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: [42]}

  const opts = [answer]

  const obj = {opts}

  const {opts: opts2} = addRestOpts()(obj)

  const exp = opts

  expect(opts2).toStrictEqual(exp)
})

test('addRestOpts works if obj is undefined', () => {
  const opts = [{key: 'answer', types: ['number'], args: ['-a', '--answer'], values: [42]}]

  const {opts: opts2} = addRestOpts(opts)()

  const exp = opts

  expect(opts2).toStrictEqual(exp)
})

test('addRestOpts passes on errors', () => {
  const opts = [{key: 'answer', types: ['number'], args: ['-a', '--answer'], values: [42]}]

  const ERRS = ['foo']

  const {errs} = addRestOpts(opts)({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})