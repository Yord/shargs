const transformOpts = require('./transformOpts')

test('transformOpts README example works', () => {
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

  const {errs, opts} = transformOpts(isFlag)(reverseFlags)(obj)

  const expOpts = [
    {key: 'age', types: ['number'], values: ['42']},
    {key: 'verbose', types: [], values: [-1]},
    {key: 'help', types: [], values: [-1]}
  ]

  const expErrs = []

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})

test('transformOpts does not apply function if predicate is undefined', () => {
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

  const {errs, opts} = transformOpts()(recordError)(obj)

  const expOpts = obj.opts

  const expErrs = []

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})