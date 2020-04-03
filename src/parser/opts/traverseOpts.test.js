const traverseOpts = require('./traverseOpts')

const tautology = _ => true

test('traverseOpts README example works', () => {
  const obj = {
    opts: [
      {key: 'age', types: ['number'], values: ['42']},
      {key: 'verbose', types: [], values: [1]},
      {key: 'help', types: [], values: [1]}
    ]
  }

  const isFlag = ({types}) => Array.isArray(types) && types.length === 0

  const reverseFlags = opt => ({
    opts: [
      {...opt, values: [-opt.values[0]]}
    ]
  })

  const {errs, opts} = traverseOpts(isFlag)(reverseFlags)(obj)

  const expOpts = [
    {key: 'age', types: ['number'], values: ['42']},
    {key: 'verbose', types: [], values: [-1]},
    {key: 'help', types: [], values: [-1]}
  ]

  const expErrs = []

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})

test('traverseOpts does not apply function if predicate is undefined', () => {
  const obj = {
    opts: [
      {key: 'age', types: ['number'], values: ['42']},
      {key: 'verbose', types: [], values: [1]},
      {key: 'help', types: [], values: [1]}
    ]
  }

  const recordError = _ => ({
    errs: ['Error']
  })

  const {errs, opts} = traverseOpts()(recordError)(obj)

  const expOpts = obj.opts

  const expErrs = []

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})

test('traverseOpts applies identity function if function is undefined', () => {
  const obj = {
    opts: [
      {key: 'age', types: ['number'], values: ['42']},
      {key: 'verbose', types: [], values: [1]},
      {key: 'help', types: [], values: [1]}
    ]
  }

  const {errs, opts} = traverseOpts(tautology)()(obj)

  const expOpts = obj.opts

  const expErrs = []

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})

test('traverseOpts works if opts is undefined', () => {
  const obj = {}

  const {opts} = traverseOpts(tautology)()(obj)

  expect(opts).toStrictEqual([])
})

test('traverseOpts works if input is undefined', () => {
  const {opts} = traverseOpts(tautology)()()

  expect(opts).toStrictEqual([])
})

test('traverseOpts passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = traverseOpts(tautology)()({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})