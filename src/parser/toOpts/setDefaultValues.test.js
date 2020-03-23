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