const addPositionalArguments = require('./addPositionalArguments')

test('addPositionalArguments works as expected', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: ['42']}
  const pos1   = {key: 'pos1', types: ['number'], args: null}
  const pos2   = {key: 'pos2', types: ['string'], args: null}

  const opts = [answer, pos1, pos2]

  const opts2 = [
    answer,
    {values: ['23']}
  ]

  const {opts: opts3} = addPositionalArguments(opts)({opts: opts2})

  const exp = [
    answer,
    {...pos1, values: ['23']}
  ]

  expect(opts3).toStrictEqual(exp)
})

test('addPositionalArguments works with variadic pos args', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: ['42']}
  const pos1   = {key: 'pos1', types: ['number'], args: null}
  const pos2   = {key: 'pos2', types: null, args: null, variadic: true}

  const opts = [answer, pos1, pos2]

  const opts2 = [
    answer,
    {values: ['23']},
    {values: ['19']},
    {values: ['42']}
  ]

  const {opts: opts3} = addPositionalArguments(opts)({opts: opts2})

  const exp = [
    answer,
    {...pos1, values: ['23']},
    {...pos2, types: ['string', 'string'], values: ['19', '42']},
  ]

  expect(opts3).toStrictEqual(exp)
})

test('addPositionalArguments works with variadic pos args that eat up all values if they are not defined last', () => {
  const answer = {key: 'answer', types: ['number'], args: ['-a', '--answer'], values: ['42']}
  const pos1   = {key: 'pos1', types: ['number'], args: null}
  const pos2   = {key: 'pos2', types: null, args: null, variadic: true}

  const opts = [answer, pos2, pos1]

  const opts2 = [
    answer,
    {values: ['23']},
    {values: ['19']},
    {values: ['42']}
  ]

  const {opts: opts3} = addPositionalArguments(opts)({opts: opts2})

  const exp = [
    answer,
    {...pos2, types: ['string', 'string', 'string'], values: ['23', '19', '42']},
  ]

  expect(opts3).toStrictEqual(exp)
})

test('addPositionalArguments works if obj is empty', () => {
  const opts = [{key: 'pos1', types: ['number'], args: null}]

  const obj = {}

  const {opts: opts2} = addPositionalArguments(opts)(obj)

  const exp = []

  expect(opts2).toStrictEqual(exp)
})

test('addPositionalArguments works if opts is undefined', () => {
  const opts = [{key: 'pos1', types: ['number'], args: null, values: ['42']}]

  const obj = {opts}

  const {opts: opts2} = addPositionalArguments()(obj)

  const exp = opts

  expect(opts2).toStrictEqual(exp)
})